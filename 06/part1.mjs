import input from "./input.mjs";
//import testOut from "./test-output.mjs";
//console.log(input);

const initial = input.split(",").map((v) => parseInt(v));
const children = [];

const iterations = 256;

const iterate = (state) => {
  let spawn = 0;
  const newState = state.map(({ value, count }, i, a) => {
    if (value === 0) {
      spawn += count;
      return { value: 6, count };
    } else {
      return { value: value - 1, count };
    }
  });

  //  console.log(`iteration:`, { spawn });
  return spawn > 0 ? newState.concat({ value: 8, count: spawn }) : newState;
};

const simulateIterations = (initialState, numberOfIterations) => {
  let endState = initialState;

  //  console.log(`\nMINE Initial state:`, logState(endState));
  //  console.log(`TEST initial state:`, testOut.split("\n")[0]);

  Array.from(Array(numberOfIterations)).forEach((v, i) => {
    //    console.log(`\nB Iteration ${i + 1}:`, logState(endState));
    endState = iterate(endState);
    //    console.log(`TEST output ${i + 1}:`, testOut.split("\n")[i + 1]);
    //    console.log(`A Iteration ${i + 1}:`, logState(endState));
  });

  return endState;
};

const logState = (state) =>
  state
    .map(({ value, count }) => `${value}`.repeat(count).split("").join(","))
    .join(",");
//  state.reduce(
//    (prev, curr) =>
//      prev.concat(`${curr.value}`.repeat(curr.count).split("").join(","), ","),
//    ""
//  );

const countTotal = (state) =>
  state.reduce((prev, curr) => prev + curr.count, 0);

//console.log(`Initial state:`, initial.join(","));
const initialState = initial.map((v) => ({ value: v, count: 1 }));
const endState = simulateIterations(initialState, iterations);

//console.log("AFTER ALL:     ", logState(endState));
console.log({ endState, l: endState.length });
console.log({ total: countTotal(endState) });
//
//writeFileSync(
//  `./out/${descriptor}-i-${initial.length}-${iterations}.mjs`,
//  `export default \`${endState.join(",")}\`;`
//);
//console.log("file written");
////26_984_457_539
//
