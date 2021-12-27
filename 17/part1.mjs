import rawInput from "./test-input.mjs";

const [xInput, yInput] = rawInput.split("target area:")[1].trim().split(", ");

const x = xInput
  .slice(2)
  .split("..")
  .map((v) => parseInt(v));
const y = yInput
  .slice(2)
  .split("..")
  .map((v) => parseInt(v));

console.log({ x, y });

const drawMap = (start = { x: 0, y: 0 }, target = []) => {
  console.log({ start, target });
  if (target.length !== 2) {
    console.log("invalid target passed to drawMap");
    return;
  }

  let map = [];

  // let rowNum = ;
  // let colNum = ;

  console.log(map.map((row) => row.join("")).join("\n"));

  return map;
};

drawMap({ x: 0, y: 0 }, [
  { x: x[0], y: y[0] },
  { x: x[1], y: y[1] },
]);
