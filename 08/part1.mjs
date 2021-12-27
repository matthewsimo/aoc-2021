import rawInput from "./input.mjs";

const input = rawInput.split("\n").map((v) => v.split(" | "));
const countKey = {
  1: 2,
  4: 4,
  7: 3,
  8: 7,
};

const key = {
  // 2
  1: ["c", "f"], // No A, B, D, E, G
  // 3
  7: ["a", "c", "f"], // No B, D, E, G
  // 4
  4: ["b", "c", "d", "f"], // No A, E, G
  // 5
  2: ["a", "c", "d", "e", "g"], // No B, F - symDiff 4 = 5
  3: ["a", "c", "d", "f", "g"], // No B, E - symDiff 4 = 5
  5: ["a", "b", "d", "f", "g"], // No C, E - symDiff 4 = 5
  // 6
  6: ["a", "b", "d", "e", "f", "g"], // No C - symDiff 4 = 3
  0: ["a", "b", "c", "e", "f", "g"], // No D - symDiff 4 = 3
  9: ["a", "b", "c", "d", "f", "g"], // No E - symDiff 4 = 2
  // 7
  8: ["a", "b", "c", "d", "e", "f", "g"],
};

const sortedKey = Object.entries(key).map(([k, v]) => ({
  k: parseInt(k),
  l: v.length,
}));

console.log({ input, sortedKey });

const intersection = (arr1, arr2) => arr1.filter((n) => arr2.includes(n));
const diff = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));
const symDiff = (arr1, arr2) =>
  arr1
    .filter((n) => !arr2.includes(n))
    .concat(arr2.filter((n) => !arr1.includes(n)));
const union = (arr1, arr2) => [...new Set([...arr1, ...arr2])];

const generateKey = (patternArray) => {
  const key = {
    a: "", // diff 7, 1
    b: "", //
    c: "", // 8 - 6
    d: "", // 8 - 0
    e: "", // 8 - 9
    f: "", //
    g: "", //
  };

  const patternNums = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  };

  patternArray.forEach((v) => {
    switch (v.length) {
      case 2:
        patternNums["1"] = v.split("");
        break;
      case 3:
        patternNums["7"] = v.split("");
        break;
      case 4:
        patternNums["4"] = v.split("");
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        patternNums["8"] = v.split("");
        break;
    }
  });

  // 2 3 5
  patternArray
    .map((v) => v.split(""))
    .filter((v) => v.length === 5)
    .forEach((v) => {
      const symD1 = symDiff(v, patternNums["1"]).length;
      const symD4 = symDiff(v, patternNums["4"]).length;
      const symD7 = symDiff(v, patternNums["7"]).length;
      const symD8 = symDiff(v, patternNums["8"]).length;
      // console.log({ count: 5, v, symD1, symD4, symD7, symD8 });

      if (symD1 === 5 && symD4 === 5 && symD7 === 4 && symD8 === 2) {
        patternNums["2"] = v;
      }

      if (symD1 === 3 && symD4 === 3 && symD7 === 2 && symD8 === 2) {
        patternNums["3"] = v;
      }

      if (symD1 === 5 && symD4 === 3 && symD7 === 4 && symD8 === 2) {
        patternNums["5"] = v;
      }
    });

  // 6, 0 ,9
  patternArray
    .map((v) => v.split(""))
    .filter((v) => v.length === 6)
    .forEach((v) => {
      const symD1 = symDiff(v, patternNums["1"]).length;
      const symD4 = symDiff(v, patternNums["4"]).length;
      const symD7 = symDiff(v, patternNums["7"]).length;
      const symD8 = symDiff(v, patternNums["8"]).length;
      // console.log({ count: 6, v, symD1, symD4, symD7, symD8 });

      if (symD1 === 6 && symD4 === 4 && symD7 === 5 && symD8 === 1) {
        patternNums["6"] = v;
      }

      if (symD1 === 4 && symD4 === 4 && symD7 === 3 && symD8 === 1) {
        patternNums["0"] = v;
      }

      if (symD1 === 4 && symD4 === 2 && symD7 === 3 && symD8 === 1) {
        patternNums["9"] = v;
      }
    });

  key["a"] = symDiff(patternNums["7"], patternNums["1"])[0];
  key["b"] = diff(
    diff(patternNums["8"], patternNums["2"]),
    patternNums["1"]
  )[0];
  key["c"] = symDiff(patternNums["8"], patternNums["6"])[0];
  key["d"] = symDiff(patternNums["8"], patternNums["0"])[0];
  key["e"] = symDiff(patternNums["8"], patternNums["9"])[0];
  key["f"] = intersection(patternNums["6"], patternNums["1"])[0];
  key["g"] = intersection(
    diff(diff(patternNums["8"], patternNums["4"]), patternNums["7"]),
    patternNums["9"]
  )[0];

  // console.log({ key, patternArray, patternNums });

  return patternNums;
};

const decodeUnknown = (pattern, v, arr) => {
  const candidates = sortedKey
    .filter((k) => k.l === v.length)
    .map((item) => item.k);
  const keyForPattern = generateKey(pattern);
  const digit = candidates
    .map((candidate) => {
      const isMatch = diff(keyForPattern[candidate], v.split("")).length === 0;
      // console.log({
      //   isMatch,
      //   candidate,
      //   v,
      //   kFP: keyForPattern[candidate],
      // });
      return isMatch ? candidate : null;
    })
    .filter((v) => v !== null)[0];
  // console.log({ pattern, key, v, candidates, digit });
  return digit;
};

const decode1478 = (key, output) => {
  //  console.log({ key, output });

  // key is length & val is the number being output
  const countKey = { 2: 1, 4: 4, 3: 7, 7: 8 };

  return output.map((v) => ({
    key,
    v: v,
    i: countKey[v.length] ? countKey[v.length] : "X",
  }));
};

const sum = (arr) => arr.reduce((prev, curr) => prev + curr, 0);

const result = input
  .map(([pattern, output]) => {
    return decode1478(pattern.split(" "), output.split(" "));
  })
  .map((v) =>
    v.map(({ key, v, i }, index, arr) => {
      return i === "X"
        ? decodeUnknown(
            key,
            v,
            arr.filter((item) => item.i !== "X")
          )
        : i;
    })
  );

const total = sum(result.map((v) => parseInt(v.join(""))));

console.log(result);
console.log(total);
