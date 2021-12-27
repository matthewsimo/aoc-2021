import input from "./input.mjs";

const inputArray = input.split(",").map((v) => parseInt(v));
const sorted = inputArray.sort((f, s) => (f < s ? -1 : f > s ? 1 : 0));

const min = sorted[0];
const max = sorted[sorted.length - 1];

const sum = (arr) => arr.reduce((prev, curr) => prev + curr, 0);

const moveAllToPosition = (position) => {
  const cost = sum(
    sorted.map((v) =>
      sum(Array.from(Array(Math.abs(v - position))).map((v, i) => i + 1))
    )
  );
  return cost;
};

console.log({
  sorted,
  min,
  max,
  possiblePositions: max - min,
  sum: sum(sorted),
  length: sorted.length,
  avg: sum(sorted) / sorted.length,
});

let attempts = [];

for (let i = 0; i <= max - min; i++) {
  const attempt = min + i;
  const cost = moveAllToPosition(attempt);
  attempts.push({ i, attempt, cost });
}

console.log({ attempts });

const lowest = attempts.reduce((prev, curr) => {
  if (curr.cost < prev.cost) {
    return curr;
  }

  return prev;
}, attempts[0]);

console.log({ lowest });
