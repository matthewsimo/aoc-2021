import rawInput from "./input.mjs";

const input = rawInput.split("\n");

const errorScore = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const incompleteScore = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const openings = ["(", "[", "{", "<"];
const closings = [")", "]", "}", ">"];

const closingMatch = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const scoreIncomplete = (closings) => {
  return closings.reduce((prev, curr) => {
    return prev * 5 + incompleteScore[curr];
  }, 0);
};

const parsedInput = input.map((line) => {
  const lineArr = line.split("");
  let currentOpenings = [];
  let validChunks = [];
  let currentChunk = [];
  let corruptions = [];
  console.log("===================");

  for (let i = 0; i < lineArr.length; i++) {
    const currentChar = lineArr[i];

    if (openings.includes(currentChar)) {
      currentOpenings.push(currentChar);
    } else if (closings.includes(currentChar)) {
      const lastOpening = currentOpenings.slice(-1);
      if (closingMatch[lastOpening] === currentChar) {
        console.log("FOUND MATCH");
        currentOpenings = currentOpenings.slice(0, -1);
      } else {
        console.log("NOT A MATCH -- CORRUPTION?");
        console.log({
          closingMatch: closingMatch[lastOpening],
          currentChar,
          currentOpenings,
        });
        corruptions.push(currentChar);
      }
    }
  }

  const incompleteClosings = currentOpenings
    .slice()
    .reverse()
    .map((v) => closingMatch[v]);

  return {
    length: lineArr.length,
    line,
    currentOpenings: currentOpenings.join(""),
    incompleteClosings: incompleteClosings.length
      ? incompleteClosings.join("")
      : null,
    incompletePoints: incompleteClosings.length
      ? scoreIncomplete(incompleteClosings)
      : 0,
    corruption0: corruptions.length ? corruptions[0] : null,
    corruptionPts: corruptions.length ? errorScore[corruptions[0]] : 0,
  };
});

const tallyCorruptions = parsedInput.reduce((prev, curr) => {
  return prev + curr.corruptionPts;
}, 0);

const incompletes = parsedInput
  .reduce((prev, curr) => {
    return curr.corruptionPts > 0 ? prev : prev.concat(curr);
  }, [])
  .sort((a, b) => a.incompletePoints - b.incompletePoints);

const incompleteWinner = incompletes[Math.floor(incompletes.length / 2)];

console.log({ parsedInput, tallyCorruptions, incompletes, incompleteWinner });
