import { expect, test } from "vitest";
import {
    createBoard,
  initGameState,
  setSelectedPieceForState,
} from "../Game";
import { PieceName } from "../pieces/PieceName";
import { createGameState } from "./movePiece.test";
import { createBishop } from "../pieces/Bishop";
import { Color } from "../pieces/ActivePiece";

test("set selected piece unselects if current is selected", () => {
  const state = initGameState();

  const bishop = state.board[0][5];

  expect(bishop?.piece.name).toEqual(PieceName.Bishop);

  const newState = setSelectedPieceForState(state, { row: 1, column: 2 });
  const noSelectedState = setSelectedPieceForState(newState, { row: 1, column: 2 });

  expect(noSelectedState.selectedPiece).toEqual(undefined);
});

test("set selected happy path", () => {
  const bishop = createBishop(1, 7, Color.White);
  const board = createBoard([
    bishop

  ])
  const state = createGameState(board, undefined, Color.Black, false)

  const newState = setSelectedPieceForState(state, { row: 1, column: 7 });

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
