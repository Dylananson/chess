import { expect, test } from "vitest";
import { initGameState, tryMovePiece, setSelectedPieceForState, movePiece, emptyBoard, Board, Coordinate } from "../Game";
import { ActivePiece, Color } from "../pieces/ActivePiece";
import { Bishop } from "../pieces/Bishop";
import { Rook } from "../pieces/Rook";
import { Queen } from "../pieces/Queen";

const addPieceToBoard = (board: Board<ActivePiece>, piece: ActivePiece, coordinates: Coordinate) => {
    return board[coordinates.row - 1][coordinates.column - 1] = piece
}

const createBoard = (pieces: Array<ActivePiece>) => {
    const board: Board<ActivePiece> = emptyBoard()
    pieces.forEach(piece => {
        board[piece.startingCoordinate.row - 1][piece.startingCoordinate.column - 1] = piece
    })
    return board
}

const coordToKey = (coord: Coordinate) => `${coord.row}${coord.column}`

const createBishop = (row: number, column: number, color: Color) => {
    return {
        piece: Bishop,
        color: color,
        id: coordToKey({ row, column }),
        startingCoordinate: { row, column },
        hasMoved: false,
    }
}

const createRook = (row: number, column: number, color: Color) => {
    return {
        piece: Rook,
        color: color,
        id: coordToKey({ row, column }),
        startingCoordinate: { row, column },
        hasMoved: false,
    }
}

const createQueen = (row: number, column: number, color: Color) => {
    return {
        piece: Queen,
        color: color,
        id: coordToKey({ row, column }),
        startingCoordinate: { row, column },
        hasMoved: false,
    }
}


test("move piece happy path", () => {
  const board = createBoard([
    createRook(1, 1, Color.White),
  ])

  const game = {
    board: board,
    selectedPiece: undefined,
    turn: Color.White,
    playerTurn: Color.White,
  }

  const gameWithSelectedPiece = setSelectedPieceForState(game, {row:1, column:1})

  if (!gameWithSelectedPiece.selectedPiece) {
    throw new Error("selected piece should be set")
  }

  const newGame = tryMovePiece(gameWithSelectedPiece, { row: 6, column: 1 });

  expect(newGame.board[5][0]?.id).toEqual("11")

  expect(newGame.board[0][0]).toEqual(undefined)
  expect(newGame.board[2][0]).toEqual(undefined)
});


test("move piece on own piece shouldn't move piece", () => {
  const game = initGameState();

  const gameWithSelectedPiece = setSelectedPieceForState(game, {row:1, column:1})

  const otherPieceId = gameWithSelectedPiece.board[0][1]?.id

  expect(otherPieceId).toBeTruthy()

  const newGame = tryMovePiece(gameWithSelectedPiece, { row: 1, column: 2 });

  //piece shoudn't be in new coordinates
  expect(newGame.board[5][0]).toEqual(undefined)

  //other piece should still be there
  expect(newGame.board[0][1]?.id).toEqual(otherPieceId)

  //piece shouldn't have moved from old coordinates
  expect(newGame.board[0][0]?.id).toEqual("WhtARook")
});




