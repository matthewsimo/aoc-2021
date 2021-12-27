import rawInput from "./input.mjs";

// console.log(rawInput);

const [rawTemplate, rawRules] = rawInput.split("\n\n");

const template = rawTemplate.split("");

const rules = {};
rawRules.split("\n").forEach((v) => {
  let [pair, insert] = v.split(" -> ");
  rules[pair] = insert;
});

const rulesPairMap = {};
Object.keys(rules).forEach((pair) => {
  const [first, second] = pair.split("");
  rulesPairMap[pair] = [`${first}${rules[pair]}`, `${rules[pair]}${second}`];
});

// console.log({ template });
// console.log({ rules });
// console.log({ rulesPairMap });

const inputToPairs = (input) => {
  let pairedInput = {};
  for (let i = 0; i + 1 < input.length; i++) {
    const pair = `${input[i]}${input[i + 1]}`;
    insertItem(pairedInput, pair);
  }

  return pairedInput;
};

const insertItem = (set, item, byCount = 1) => {
  if (set[item]) {
    set[item] += byCount;
  } else {
    set[item] = byCount;
  }
  return set;
};

const insertPairs = (inputMap) => {
  const newInput = {};
  Object.keys(inputMap).forEach((pair) => {
    const count = inputMap[pair];
    const newChar = rules[pair];
    const [first, second] = rulesPairMap[pair];
    // console.log({ pair, count, newChar, ruleFor: rulesPairMap[pair] });

    insertItem(charTotals, newChar, count);
    insertItem(newInput, first, count);
    insertItem(newInput, second, count);
  });

  return newInput;
};

const steps = 40;
let pairedInput = inputToPairs(template);
const charTotals = template.reduce((prev, curr) => {
  insertItem(prev, curr);
  return prev;
}, {});

// console.log({ pairedInput });
// console.log({ charTotals });

for (let step = 0; step < steps; step++) {
  pairedInput = insertPairs(pairedInput);
  // console.log(`after ${step + 1}`);
  // console.log({ pairedInput });
  // console.log({ charTotals });
}

const highest = Math.max(...Object.values(charTotals));
const lowest = Math.min(...Object.values(charTotals));
console.log(`${highest} - ${lowest} = ${highest - lowest}`);
