import rawInput from "./input.mjs";

const [rawDots, rawFolds] = rawInput.split("\n\n");

const dotPositions = rawDots
  .split("\n")
  .map((d) => d.split(",").map((d) => parseInt(d)))
  .map(([x, y]) => ({ x, y }));
const folds = rawFolds
  .split("\n")
  .map((f) => f.slice(11).split("="))
  .map(([direction, position]) => [direction, parseInt(position)]);
const highestX = dotPositions.reduce(
  (prev, curr) => (curr.x > prev ? curr.x : prev),
  0
);
const highestY = dotPositions.reduce(
  (prev, curr) => (curr.y > prev ? curr.y : prev),
  0
);

let dots = [];

for (let y = 0; y < highestY + 1; y++) {
  let row = Array.from(".".repeat(highestX + 1));

  for (let x = 0; x < highestX; x++) {}

  dots[y] = row;
}

dotPositions.forEach(({ x, y }) => (dots[y][x] = "#"));

const plotDots = (dots) => {
  return dots.map((row) => row.join("")).join("\n");
};

const doFold = (dots, fold) => {
  const [direction, position] = fold;
  let newDots;

  if (direction === "x") {
    newDots = dots.slice();
    newDots.forEach((row, rowI) => {
      newDots[rowI] = row.slice(0, position);
      let invertDots = row.slice(position + 1);
      invertDots.forEach((invertDot, invertDotI) => {
        const newIndex = position - (invertDotI + 1);
        if (invertDot === "#") {
          newDots[rowI][newIndex] = "#";
        }
      });
    });
  } else if (direction === "y") {
    newDots = dots.slice(0, position);
    let invertDots = dots.slice(position + 1);
    invertDots.forEach((row, rowI) => {
      const newRowIndex = position - (rowI + 1);
      row.forEach((dot, i) => {
        if (dot === "#") {
          newDots[newRowIndex][i] = "#";
        }
      });
    });
  }

  return newDots;
};

const countDots = (dots) => {
  return dots.map((row) => row.filter((dot) => dot === "#").join("")).join("")
    .length;
};

// part 1
// const afterFold = doFold(dots, folds[0]);
// console.log(plotDots(afterFold));
// console.log(countDots(afterFold));

//part 2
folds.forEach((fold, i) => {
  dots = doFold(dots, fold);
  console.log(`Fold ${i + 1} - ${countDots(dots)}`);
  console.log(plotDots(dots));
});
