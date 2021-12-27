import rawInput from "./input.mjs";
const input = rawInput
  .split("\n")
  .map((v) => v.split("").map((v) => parseInt(v)));

const adjacentsForEach = input.map((row, rowIndex) =>
  row.map((height, index, a) => {
    const adjacents = [];
    if (a[index + 1] >= 0) {
      adjacents.push({ height: a[index + 1], index: index + 1, rowIndex });
    }

    if (a[index - 1] >= 0) {
      adjacents.push({ height: a[index - 1], index: index - 1, rowIndex });
    }

    if (input[rowIndex - 1] && input[rowIndex - 1][index] >= 0) {
      adjacents.push({
        height: input[rowIndex - 1][index],
        rowIndex: rowIndex - 1,
        index,
      });
    }

    if (input[rowIndex + 1] && input[rowIndex + 1][index] >= 0) {
      adjacents.push({
        height: input[rowIndex + 1][index],
        rowIndex: rowIndex + 1,
        index,
      });
    }

    const isLowpoint = adjacents.every((v) => height < v.height);

    return {
      height,
      rowIndex,
      index,
      adjacents,
      isLowpoint,
      basinAdjacents: adjacents.filter((a) => a.height !== 9),
    };
  })
);

const sum = (arr) => arr.reduce((prev, curr) => prev + curr, 0);

const total = sum(
  adjacentsForEach
    .flat()
    .map(({ height, isLowpoint }) => (isLowpoint ? height + 1 : 0))
);

const getValidPoint = (rowIndex, index) => {
  const point = adjacentsForEach
    .flat()
    .filter((v) => v.rowIndex === rowIndex && v.index === index);

  // console.log({ getPoint: true, rowIndex, index, point });
  return point.length > 0 ? (point[0].height === 9 ? null : point[0]) : null;
};

const getBasinAdjacents = (basinPoint) =>
  basinPoint.adjacents
    .map((p) => getValidPoint(p.rowIndex, p.index))
    .filter((p) => p);

const includes = (basinPoints, point) => {
  const hasPoint = basinPoints.some(
    (p) => p.rowIndex === point.rowIndex && p.index === point.index
  );
  // console.log({ hasPoint, basinPoints, point });
  return hasPoint;
};

const recurseBasinAdjacents = (point) => {
  // console.log("---------");
  // console.log(JSON.stringify(point, null, 2));
  // console.log(JSON.stringify(point.basinAdjacents, null, 2));

  return point.basinAdjacents.map((basinAdjacent) =>
    point.height < basinAdjacent.height
      ? recurseBasinAdjacents(
          getValidPoint(basinAdjacent.rowIndex, basinAdjacent.index)
        ).flat()
      : point
  );
};

const basinPoints = adjacentsForEach.flat().filter((v) => v.isLowpoint);

//console.log({ total });
//console.log(basinPoints[0]);
//console.log("===================");

// const recurseTest = [basinPoints[3]].concat(
//   recurseBasinAdjacents(basinPoints[3]).flat()
// );

// console.log({ recurseTest, l: recurseTest.length });
// const setOfRecurse = [...new Set(recurseTest)];
// console.log(setOfRecurse);
// console.log(setOfRecurse.length);
// console.log(JSON.stringify(recurseTest), null, 2));

const basins = basinPoints.map((basinPoint) => {
  // console.log({ basinPoint });
  return [
    ...new Set([basinPoint].concat(recurseBasinAdjacents(basinPoint).flat())),
  ];
});

const basinCounts = basins.map((b) => b.length).sort((a, b) => b - a);

const basinSize = basinCounts[0] * basinCounts[1] * basinCounts[2];

console.log({ basinCounts, basinSize });
/*

























const getBasinForPoint = (point, excludeList = []) => {
  let basinForPoint = [];
  if (excludeList.length === 0) {
    excludeList.push(point);
  }

  const left = getValidPoint(point.rowIndex, point.index - 1);
  if (left && !includes(excludeList, left)) {
    console.log({ left, point, excludeList });
    basinForPoint.push(left);
  }

  const right = getValidPoint(point.rowIndex, point.index + 1);
  if (right && !includes(excludeList, right)) {
    console.log({ right, point, excludeList });
    basinForPoint.push(right);
  }

  const top = getValidPoint(point.rowIndex - 1, point.index);
  if (top && !includes(excludeList, top)) {
    console.log({ top, point, excludeList });
    basinForPoint.push(top);
  }

  const bot = getValidPoint(point.rowIndex + 1, point.index);
  if (bot && !includes(excludeList, bot)) {
    console.log({ bot, point, excludeList });
    basinForPoint.push(bot);
  }

  return [point]
    .concat(
      basinForPoint.map((v) =>
        getBasinForPoint(v, excludeList.concat(basinForPoint))
      )
    )
    .flat();
};

*/
