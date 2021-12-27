import input from "./input.mjs";

const lowest = { x: undefined, y: undefined };
const highest = { x: undefined, y: undefined };

const inputArray = input.split("\n").map((v, i) => {
  const [start, end] = v.split(" -> ");
  const [startX, startY] = start.split(",");
  const [endX, endY] = end.split(",");

  return [
    { x: parseInt(startX), y: parseInt(startY) },
    { x: parseInt(endX), y: parseInt(endY) },
  ];
});

const getDimensions = (arr) => {
  return arr.reduce((prev, curr) => {
    const lX = curr[0].x < curr[1].x ? curr[0].x : curr[1].x;
    const lY = curr[0].y < curr[1].y ? curr[0].y : curr[1].y;
    const hX = curr[0].x > curr[1].x ? curr[0].x : curr[1].x;
    const hY = curr[0].y > curr[1].y ? curr[0].y : curr[1].y;

    const currDimensions = {
      lowest: { x: lX, y: lY },
      highest: { x: hX, y: hY },
    };

    if (prev) {
      if (lX < prev.lowest.x) {
        prev.lowest.x = lX;
      }

      if (lY < prev.lowest.y) {
        prev.lowest.y = lY;
      }

      if (hX > prev.highest.x) {
        prev.highest.x = hX;
      }

      if (hY > prev.highest.y) {
        prev.highest.y = hY;
      }

      return prev;
    } else {
      return currDimensions;
    }
  }, null);
};

const initDiagramForDimensions = (dimensions) => {
  const rowsNum = dimensions.highest.y - dimensions.lowest.y + 1;
  const colsNum = dimensions.highest.x - dimensions.lowest.x + 1;

  const diagram = Array.from(Array(rowsNum)).map((row) => {
    return Array.from(Array(colsNum)).map((v) => 0);
  });

  return diagram;
};

const diagramToString = (diagram) => {
  return diagram.map((row) => row.join("")).join("\n");
};

const dimensions = getDimensions(inputArray);
const diagram = initDiagramForDimensions(dimensions);

const markLine = (diagram, line, offset) => {
  const direction =
    line[0].x === line[1].x
      ? "horizontal"
      : line[0].y === line[1].y
      ? "vertical"
      : "diagonal";

  let markPoints = [];

  if (direction === "horizontal") {
    //    console.log(
    //      `${line[0].y}->${line[1].y}`,
    //      line[0].y < line[1].y ? "up" : "down"
    //    );
    for (
      let i = line[0].y;
      line[0].y < line[1].y ? i <= line[1].y : i >= line[1].y;
      line[0].y < line[1].y ? i++ : i--
    ) {
      markPoints.push({ x: line[0].x, y: i });
    }
  } else if (direction === "vertical") {
    //    console.log(
    //      `${line[0].x}->${line[1].x}`,
    //      line[0].x < line[1].x ? "up" : "down"
    //    );
    for (
      let i = line[0].x;
      line[0].x < line[1].x ? i <= line[1].x : i >= line[1].x;
      line[0].x < line[1].x ? i++ : i--
    ) {
      markPoints.push({ x: i, y: line[0].y });
    }
  } else {
    console.log("diagonal");

    // x0 -> x1 & y0 -> y1

    const x = Math.abs(line[0].x - line[1].x);
    const y = Math.abs(line[0].y - line[1].y);

    for (let i = 0; i <= x; i++) {
      const pX = line[0].x < line[1].x ? line[0].x + i : line[0].x - i;
      const pY = line[0].y < line[1].y ? line[0].y + i : line[0].y - i;

      //console.log({ i, x, y, pX, pY });
      markPoints.push({ x: pX, y: pY });
    }
  }

  console.log({ direction, markPoints, line });

  markPoints.forEach((v) => {
    diagram[v.y - offset.y][v.x - offset.x] += 1;
  });

  return diagram;
};

const calcDanger = (diagram) => {
  return diagram.map((v) => v.filter((point) => point >= 2)).flat().length;
};

//console.log(inputArray);
console.log({ dimensions });
//console.log({ d: diagramToString(diagram) });
//console.log({ lowest, highest });

//console.log({ diagram });

let updatedDiagram = diagram;
inputArray.forEach((cmd) => {
  updatedDiagram = markLine(updatedDiagram, cmd, dimensions.lowest);
});

//console.log({ updatedDiagram });
console.log(diagramToString(updatedDiagram));
console.log(calcDanger(updatedDiagram));
