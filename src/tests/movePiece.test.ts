import { expect, test } from "vitest";
import { initGameState, movePiece, PieceName, setSelectedPieceForState } from "../Board";

test("move piece happy path", () => {

  const game = initGameState();

  const gameWithSelectedPiece = setSelectedPieceForState(game, {row:1, column:1})

  const newGame = movePiece(gameWithSelectedPiece, { row: 6, column: 1 });

  expect(newGame.board[5][0]?.id).toEqual("WhtARook")

  expect(newGame.board[0][0]).toEqual(undefined)
});

test("move piece happy path twice", () => {
  const game = initGameState();

  const gameWithSelectedPiece = setSelectedPieceForState(game, {row:1, column:1})

  const newGame = movePiece(gameWithSelectedPiece, { row: 6, column: 1 });

  expect(newGame.board[5][0]?.id).toEqual("WhtARook")

  const nextGameWithSelectedPiece = setSelectedPieceForState(newGame, {row:6, column:1})

  const nextGame = movePiece(nextGameWithSelectedPiece, {row: 6, column: 3})

  expect(nextGame.board[0][0]).toEqual(undefined)
  expect(nextGame.board[5][0]).toEqual(undefined)
  expect(nextGame.board[5][2]?.id).toEqual("WhtARook")
});

test("move piece on own piece shouldn't move piece", () => {
  const game = initGameState();

  const gameWithSelectedPiece = setSelectedPieceForState(game, {row:1, column:1})

  const otherPieceId = gameWithSelectedPiece.board[0][1]?.id

  expect(otherPieceId).toBeTruthy()

  const newGame = movePiece(gameWithSelectedPiece, { row: 1, column: 2 });

  //piece shoudn't be in new coordinates
  expect(newGame.board[5][0]).toEqual(undefined)

  //other piece should still be there
  expect(newGame.board[0][1]?.id).toEqual(otherPieceId)

  //piece shouldn't have moved from old coordinates
  expect(newGame.board[0][0]?.id).toEqual("WhtARook")
});
