import rawInput from "./input.mjs";
// const rawInput = `11111
// 19991
// 19191
// 19991
// 11111`;

const input = rawInput.split("\n").map((row, rowI) =>
  row.split("").map((v, i) => {
    return {
      value: parseInt(v),
      row: rowI,
      col: i,
    };
  })
);

// console.log(input);
const rows = input.length;
const cols = input[0].length;

let flashCount = 0;
const stepNumber = 195;

const output = (input) =>
  input
    .map((v, i) => v.value)
    .map((v, i) => ((i + 1) % cols ? `${v}` : `${v}\n`))
    .join("");

let stepInput = input.flat().map((v, i) => {
  v.i = i;
  return v;
});

console.log({ rows, cols });
console.log(output(stepInput));

const getItem = (row, col) => {
  const candidates = stepInput.filter((v) => v.row === row && v.col === col);
  return candidates.length ? candidates[0] : null;
};

const getAdjacentsForItem = (row, col) => {
  let adjacents = [];

  adjacents.push(getItem(row - 1, col - 1));
  adjacents.push(getItem(row, col - 1));
  adjacents.push(getItem(row + 1, col - 1));

  adjacents.push(getItem(row - 1, col));
  adjacents.push(getItem(row + 1, col));

  adjacents.push(getItem(row - 1, col + 1));
  adjacents.push(getItem(row, col + 1));
  adjacents.push(getItem(row + 1, col + 1));

  return adjacents.filter((v) => v);
};

const incrementItem = ({ i, row, col }) => {
  // console.log(`incrementing`, { i, row, col });
  stepInput[i].value += 1;

  if (stepInput[i].value > 9 && !stepInput[i].flashed) {
    stepInput[i].flashed = true;

    // console.log(`incrementing adjacents for:`, { i, row, col });
    const adjacents = getAdjacentsForItem(row, col);
    // console.log(adjacents);
    adjacents.forEach((item) => {
      if (item.value <= 9) {
        incrementItem(item);
      }
    });
  }
};

const tallyAndReset = ({ i, row, col }) => {
  if (stepInput[i].value > 9) {
    flashCount++;
    stepInput[i].value = 0;
    stepInput[i].flashed = false;
  }
};

const runStep = () => {
  for (let i = 0; i < stepInput.length; i++) {
    // console.log(`stepInput: ${i}`, stepInput[i]);
    incrementItem(stepInput[i]);
  }

  for (let i = 0; i < stepInput.length; i++) {
    tallyAndReset(stepInput[i]);
  }
};

let keepRunning = true;

const allFlashCheck = () => {
  if (stepInput.every((i) => i.value === 0)) {
    keepRunning = false;
  }
};

for (let i = 0; keepRunning; i++) {
  console.log(`step: ${i + 1}`);
  runStep();

  allFlashCheck();

  console.log(`step: ${i + 1}`);
  console.log(output(stepInput));
}

console.log({ flashCount, stepNumber });
