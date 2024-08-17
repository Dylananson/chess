import { expect, test } from "vitest";
import { ActivePiece, Bishop, BishopMoves, Board, Color, Coordinate, emptyBoard, initGameState, movePiece, PieceName, Rook, RookMoves, setSelectedPieceForState } from "../Board";

test("move piece happy path", () => {

  const game = initGameState();

  const gameWithSelectedPiece = setSelectedPieceForState(game, { row: 1, column: 1 })

  const newGame = movePiece(gameWithSelectedPiece, { row: 6, column: 1 });

  expect(newGame.board[5][0]?.id).toEqual("WhtARook")

  expect(newGame.board[0][0]).toEqual(undefined)
});

test("move piece happy path twice", () => {
  const game = initGameState();

  const gameWithSelectedPiece = setSelectedPieceForState(game, { row: 1, column: 1 })

  const newGame = movePiece(gameWithSelectedPiece, { row: 6, column: 1 });

  expect(newGame.board[5][0]?.id).toEqual("WhtARook")

  const nextGameWithSelectedPiece = setSelectedPieceForState(newGame, { row: 6, column: 1 })

  const nextGame = movePiece(nextGameWithSelectedPiece, { row: 6, column: 3 })

  expect(nextGame.board[0][0]).toEqual(undefined)
  expect(nextGame.board[5][0]).toEqual(undefined)
  expect(nextGame.board[5][2]?.id).toEqual("WhtARook")
});

test("move piece on own piece shouldn't move piece", () => {
  const game = initGameState();

  const gameWithSelectedPiece = setSelectedPieceForState(game, { row: 1, column: 1 })

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


test("filter moves removes invalid based on on blocked rook", () => {
  const board: Board<ActivePiece> = emptyBoard()
  const rook1: ActivePiece = {
    piece: Rook,
    color: Color.White,
    id: "Rook1",
    startingCoordinate: { row: 1, column: 1 },
  }

  const rook2: ActivePiece = {
    piece: Rook,
    color: Color.White,
    id: "Rook2",
    startingCoordinate: { row: 2, column: 1 },
  }

  board[0][0] = rook1
  board[1][0] = rook2

  const validMoves = RookMoves({ row: 1, column: 1 }, board)

  const expected = [
    { row: 1, column: 2 },
    { row: 1, column: 3 },
    { row: 1, column: 4 },
    { row: 1, column: 5 },
    { row: 1, column: 6 },
    { row: 1, column: 7 },
    { row: 1, column: 8 },
  ]

  expect(validMoves).toEqual(expected)
});


test("bishop moves starting position", () => {
  const board: Board<ActivePiece> = initGameState().board


  const validMoves = BishopMoves({ row: 1, column: 7 }, board)

  const expected = [
    { row: 2, column: 6 },
    { row: 2, column: 8 },
    { row: 3, column: 5 },
    { row: 4, column: 4 },
    { row: 5, column: 3 },
    { row: 6, column: 2 },
    { row: 7, column: 1 }
  ]

  expect(validMoves.map(coord => parseInt(`${coord.row}${coord.column}`)).sort()).toEqual(expected.map(coord => parseInt(`${coord.row}${coord.column}`)))
});



