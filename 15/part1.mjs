import rawInput from "./input.mjs";
import fs from "fs";

// console.log(rawInput);

const inputGraph = rawInput
  .split("\n")
  .map((line, row) =>
    line.split("").map((risk, col) => ({ row, col, risk: parseInt(risk) }))
  );

const rows = inputGraph.length;
const cols = inputGraph[0].length;

// console.log(inputGraph, rows, cols);

const adjacentsForNode = (graph, node) => {
  let adjacents = [];
  const { row, col } = node;
  const rows = graph.length;
  const cols = graph[0].length;

  // console.log({ row, col, rows, cols, item: graph[row][col] });

  if (row - 1 > 0) {
    // console.log({ r: row - 1, c: col, pushItem: graph[row - 1][col] });
    adjacents.push(graph[row - 1][col]);
  }

  if (row + 1 < rows) {
    // console.log({ r: row + 1, c: col, pushItem: graph[row + 1][col] });
    adjacents.push(graph[row + 1][col]);
  }

  if (col - 1 > 0) {
    // console.log({ r: row, c: col - 1, pushItem: graph[row][col - 1] });
    adjacents.push(graph[row][col - 1]);
  }

  if (col + 1 < cols) {
    // console.log({ r: row, c: col + 1, pushItem: graph[row][col + 1] });
    adjacents.push(graph[row][col + 1]);
  }

  return adjacents;
};

const getDistanceFrom = (node, end) =>
  end.row + end.col - (node.row + node.col);

const findPathForGraph = (graph, start, end) => {
  // console.log(graph, start, end);
  // Candidate Path:
  //  - cost: accumulated risk cost from start
  //  - distance: (finish row + col ) - (pos row + col)
  //  - path: [positions]
  // - complete: bool
  let candidatePaths = [
    {
      cost: 0,
      distance: getDistanceFrom(start, end),
      path: [start],
    },
  ];
  const checkedNodes = new Set();
  checkedNodes.add(`row${start.row}col${start.col}`);
  let winningPath;
  let counter = 0;
  while (!winningPath) {
    // console.log(candidatePaths);
    const pathToEvaluate = candidatePaths.shift();
    // console.log({ pathToEvaluate, candidatePaths });
    if (!pathToEvaluate) {
      console.log(candidatePaths);
      console.log(checkedNodes.size);
    }
    const nextNodes = adjacentsForNode(graph, pathToEvaluate.path.slice(-1)[0]);
    // console.log({ nextNodes });
    nextNodes.forEach((newNode) => {
      if (!checkedNodes.has(`row${newNode.row}col${newNode.col}`)) {
        checkedNodes.add(`row${newNode.row}col${newNode.col}`);
        let newPath = {
          cost: pathToEvaluate.cost + newNode.risk,
          distance: getDistanceFrom(newNode, end),
          path: pathToEvaluate.path.concat(newNode),
        };
        // console.log({ newPath });
        if (newPath.distance === 0) {
          winningPath = newPath;
        } else {
          candidatePaths.push(newPath);
        }
      }
    });
    // console.log(`candidatePaths before:`);
    // candidatePaths.slice(0, 5).forEach((v) => console.log(v));
    // Sort by distance remaining, then by cost if equal (lowest first)
    candidatePaths.sort((a, b) => {
      return a.cost - b.cost;
    });
    // console.log(`candidatePaths after:`);
    // candidatePaths.slice(0, 5).forEach((v) => console.log(v));
    counter++;
  }
  return winningPath;
};

// Part 1
// const path = findPathForGraph(
//   inputGraph,
//   inputGraph[0][0],
//   inputGraph[rows - 1][cols - 1]
// );
// console.log(`PATH COST: ${path.cost}`);

// Part 2

const incrementCols = (row, byN) => {
  const l = row.length;
  return row.map((item, i) => {
    const newRisk = item.risk + byN > 9 ? item.risk + byN - 9 : item.risk + byN;
    return { ...item, col: item.col + l * byN, risk: newRisk };
  });
};

const incrementRows = (graph, byN) => {
  const l = graph.length;
  return graph.map((row) =>
    row.map((item) => {
      const newRisk =
        item.risk + byN > 9 ? item.risk + byN - 9 : item.risk + byN;
      return { ...item, row: item.row + l * byN, risk: newRisk };
    })
  );
};

const dupeCols = (row) => {
  return row.concat(
    incrementCols(row, 1),
    incrementCols(row, 2),
    incrementCols(row, 3),
    incrementCols(row, 4)
  );
};

// 0 1 2 3 4
// 1 2 3 4 5
// 2 3 4 5 6
// 3 4 5 6 7
// 4 5 6 7 8
const generateFullMap = (graph) => {
  const fullCols = graph.map((row, rowN) => dupeCols(row));
  return fullCols.concat(
    incrementRows(fullCols, 1),
    incrementRows(fullCols, 2),
    incrementRows(fullCols, 3),
    incrementRows(fullCols, 4)
  );
};

const fullMap = generateFullMap(inputGraph);
const fullMapRows = fullMap.length;
const fullMapCols = fullMap[0].length;

// console.log(fullMap);
// console.log({ fullMapRows, fullMapCols });
// console.log({ itemCount: fullMap.flat().reduce((prev, curr) => prev + 1, 0) });
//
const path = findPathForGraph(
  fullMap,
  fullMap[0][0],
  fullMap[fullMapRows - 1][fullMapCols - 1]
);
console.log(`PATH: ${path.cost}`);
// console.log(path);
