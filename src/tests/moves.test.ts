import { expect, test } from "vitest";
import { QueenMoves, BishopMoves, KnightMoves, RookMoves, emptyBoard, ActivePiece, Board, Queen, Color } from "../Board";

test("bishop moves works", () => {
  const moves = BishopMoves({ row: 1, column: 1 }, emptyBoard());

  expect(moves).toEqual([
    { row: 2, column: 2 },
    { row: 3, column: 3 },
    { row: 4, column: 4 },
    { row: 5, column: 5 },
    { row: 6, column: 6 },
    { row: 7, column: 7 },
    { row: 8, column: 8 },
  ]);
});

test("knight moves works", () => {
  const moves = KnightMoves({ row: 4, column: 4 }, emptyBoard());

  expect(moves.map((a) => `${a.row}${a.column}`).sort()).toEqual(
    [
      { row: 6, column: 5 },
      { row: 6, column: 3 },
      { row: 2, column: 5 },
      { row: 2, column: 3 },

      { row: 3, column: 6 },
      { row: 5, column: 6 },
      { row: 3, column: 2 },
      { row: 5, column: 2 },
    ]
      .map((a) => `${a.row}${a.column}`)
      .sort(),
  );
});

test("knight moves works at starting pos 8,3", () => {
  const moves = KnightMoves({ row: 8, column: 3 }, emptyBoard());

  expect(moves.map((a) => `${a.row}${a.column}`).sort()).toEqual(
    [
      { row: 7, column: 1 },
      { row: 6, column: 2 },
      { row: 6, column: 4 },
      { row: 7, column: 5 },
    ]
      .map((a) => `${a.row}${a.column}`)
      .sort(),
  );
});

test("rook moves works", () => {
  const moves = RookMoves({ row: 4, column: 4 }, emptyBoard());

  const expected = [
    { row: 1, column: 4 },
    { row: 2, column: 4 },
    { row: 3, column: 4 },
    { row: 5, column: 4 },
    { row: 6, column: 4 },
    { row: 7, column: 4 },
    { row: 8, column: 4 },
    { row: 4, column: 1 },
    { row: 4, column: 2 },
    { row: 4, column: 3 },
    { row: 4, column: 5 },
    { row: 4, column: 6 },
    { row: 4, column: 7 },
    { row: 4, column: 8 },
  ];

  expect(moves.map((a) => `${a.row}${a.column}`).sort()).toEqual(
    expected.map((a) => `${a.row}${a.column}`).sort(),
  );
});

test("queen moves works", () => {

  const board :Board<ActivePiece>= emptyBoard()

  board[3][3] = {
    color : Color.White,
    piece : Queen,
    startingCoordinate : {row: 1, column:1},
    id :  "queen"
  }

  const moves = QueenMoves({ row: 4, column: 4 }, board);

  const expected = [
    { row: 1, column: 1 },
    { row: 2, column: 2 },
    { row: 3, column: 3 },
    { row: 5, column: 5 },
    { row: 6, column: 6 },
    { row: 7, column: 7 },
    { row: 8, column: 8 },

    { row: 5, column: 3 },
    { row: 6, column: 2 },
    { row: 7, column: 1 },
    { row: 3, column: 5 },
    { row: 2, column: 6 },
    { row: 1, column: 7 },

    { row: 1, column: 4 },
    { row: 2, column: 4 },
    { row: 3, column: 4 },
    { row: 5, column: 4 },
    { row: 6, column: 4 },
    { row: 7, column: 4 },
    { row: 8, column: 4 },
    { row: 4, column: 1 },
    { row: 4, column: 2 },
    { row: 4, column: 3 },
    { row: 4, column: 5 },
    { row: 4, column: 6 },
    { row: 4, column: 7 },
    { row: 4, column: 8 },
  ];

  expect(moves.map((a) => `${a.row}${a.column}`).sort()).toEqual(
    expected.map((a) => `${a.row}${a.column}`).sort(),
  );
});
