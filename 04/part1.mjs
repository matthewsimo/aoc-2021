import { input } from "./input.mjs";

const [drawNumbersRaw, ...boardsRaw] = input.split("\n\n");

let drawNumbers = drawNumbersRaw.split(",").map((v) => parseInt(v));
let boards = boardsRaw.map((v) =>
  v.split("\n").map((v) =>
    v
      .split(" ")
      .filter((v) => v !== "")
      .map((v) => parseInt(v))
  )
);

//console.log(drawNumbers);
//console.log(boards);

let winners = [];

const boardRowAndCol = 5;

console.log({ drawNumbers });
for (let drawIndex = 0; drawIndex < drawNumbers.length; drawIndex++) {
  console.log({
    drawIndex,
    drawNumber: drawNumbers[drawIndex],
    wL: winners.length,
    bL: boards.length,
  });
  let drawNumber = drawNumbers[drawIndex];

  if (winners.length == boards.length) {
    break;
  }
  // Update boards
  boards.forEach((board, boardIndex) => {
    if (!winners.some((winner) => winner.boardIndex === boardIndex)) {
      board.forEach((boardRow) => {
        const drawIndex = boardRow.indexOf(drawNumber);
        if (drawIndex > -1) {
          boardRow[drawIndex] = "XX";
        }
      });
    }
  });

  // Check winners
  boards.forEach((board, boardIndex) => {
    board.forEach((boardRow, i) => {
      if (!winners.some((winner) => winner.boardIndex === boardIndex)) {
        let isWinner = [];
        if (boardRow.every((v) => v === "XX")) {
          console.log("row winner");
          isWinner.push("row");
        }

        const iCol = Array.from(Array(boardRowAndCol)).map((v, j) => {
          return board[j][i];
        });

        if (iCol.every((v) => v === "XX")) {
          console.log("col winner");
          isWinner.push("col");
        }

        if (isWinner.length > 0) {
          winners.push({
            boardIndex,
            i,
            type: isWinner,
            drawNumber,
          });
        }
      }
    });
  });

  console.log({ winners, drawIndex, drawNumber });
  console.log({ board0: boards[0], board1: boards[1], board2: boards[2] });
}

if (winners.length) {
  console.log(winners);
  // Calculate score

  const winner = winners[winners.length - 1];
  const winningBoard = boards[winner.boardIndex];
  console.log({
    winner,
    winningBoard,
  });

  const score =
    winningBoard
      .reduce((prev, curr) => prev.concat(curr), [])
      .reduce((prev, curr) => (curr === "XX" ? prev : prev + curr), 0) *
    winner.drawNumber;
  console.log({ score });
}

//drawNumbers.forEach((drawNumber, drawNumberIndex) => {
//  if (drawNumberIndex > maxCount) return;
//
//  boards.forEach((board, i) => {
//    board.forEach((boardRow) => {
//      const drawIndex = boardRow.indexOf(drawNumber);
//      if (drawIndex > -1) {
//        boardRow[drawIndex] = "XX";
//      }
//    });
//
//    //console.log({ drawNumber, board });
//  });
//
//  boards.forEach((board) => {
//    let isWinner = false;
//    board.forEach((boardRow, i) => {
//      if (boardRow.every((v) => v === "XX")) {
//        console.log("row winner");
//        isWinner = true;
//      }
//
//      const iCol = Array.from(Array(boardRowAndCol)).map((v, j) => {
//        return board[j][i];
//      });
//
//      if (iCol.every((v) => v === "XX")) {
//        console.log("col winner");
//        isWinner = true;
//      }
//    });
//    //    for (let i = 0; i < boardRowAndCol; i++) {
//    //
//    //      board[i].every(v => v === 'XX');
//    //
//    //      for (let j = 0; j < boardRowAndCol; j++) {
//    //
//    //        console.log(i)
//    //        // check rows
//    //        // check columns
//    //      }
//    //    }
//  });
//
//  // mark each board
//  // check if winner
//  // Calculate score
//});
