import { expect, test } from "vitest";
import {
  emptyBoard,
  initGameState,
  PieceName,
  setSelectedPieceForState,
} from "../Board";

test("set selected piece unselects if current is selected", () => {
  const state = initGameState();

  const bishop = state.board[0][6];

  expect(bishop?.piece.name).toEqual(PieceName.Bishop);

  const newState = setSelectedPieceForState(state, {row: 1, column: 2});
  const noSelectedState = setSelectedPieceForState(newState, {row:1, column:2});

  expect(noSelectedState.selectedPiece).toEqual(undefined);
});

test("set selected happy path", () => {
  const state = initGameState();

  const bishop = state.board[0][6];

  expect(bishop?.id).toEqual("WhtGBishop");

  const newState = setSelectedPieceForState(state, {row: 1, column: 7});

  const expectedMoves = [
    { row: 2, column: 2 },
    { row: 3, column: 3 },
    { row: 4, column: 4 },
    { row: 5, column: 5 },
    { row: 6, column: 6 },
    { row: 7, column: 7 },
    { row: 8, column: 8 },
  ];

  const expectedResult = [
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      undefined,
      true,
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      undefined,
      undefined,
      undefined,
    ],
    [
      undefined,
      undefined,
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      undefined,
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  ];

  expect(newState.selectedPiece?.moves).toEqual(expectedResult);
});
