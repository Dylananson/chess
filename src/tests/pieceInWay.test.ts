import { expect, test } from "vitest";
import { isPieceInWay, BoardArray, emptyBoard } from "../Board";
import { ActivePiece, Color } from "../pieces/ActivePiece";
import { createRook } from "../pieces/Rook";
import { createBishop } from "../pieces/Bishop";

const createBoard = (pieces: Array<ActivePiece>) => {
    const board: BoardArray<ActivePiece> = emptyBoard()
    pieces.forEach(piece => {
        board[piece.startingCoordinate.row - 1][piece.startingCoordinate.column - 1] = piece
    })
    return board
}

test("piece not in the way rook going right", () => {
    const rook = createRook(Color.White, { row: 4, column: 4 })
    const board = createBoard([rook])
    const endingCoordinate = { row: 4, column: 8 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way rook going left", () => {
    const rook = createRook(Color.White, { row: 4, column: 4 })
    const board = createBoard([rook])
    const endingCoordinate = { row: 4, column: 1 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})


test("piece not in the way rook going up", () => {
    const rook = createRook(Color.White, { row: 4, column: 4 })
    const board = createBoard([rook])
    const endingCoordinate = { row: 8, column: 4 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way rook going down", () => {
    const rook = createRook(Color.White, { row: 4, column: 4 })
    const board = createBoard([rook])
    const endingCoordinate = { row: 1, column: 4 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})


test("piece in the way rook going down", () => {
    const rook = createRook(Color.White, { row: 4, column: 4 })
    const rook2 = createRook(Color.White, { row: 3, column: 4 })
    const board = createBoard([rook, rook2])
    const endingCoordinate = { row: 1, column: 4 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way rook going up", () => {
    const rook = createRook(Color.White, { row: 4, column: 4 })
    const rook2 = createRook(Color.White, { row: 5, column: 4 })
    const board = createBoard([rook, rook2])
    const endingCoordinate = { row: 8, column: 4 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})


test("piece in the way rook going left", () => {
    const rook = createRook(Color.White, { row: 4, column: 4 })
    const rook2 = createRook(Color.White, { row: 4, column: 3 })
    const board = createBoard([rook, rook2])
    const endingCoordinate = { row: 4, column: 1 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way rook going right", () => {
    const rook = createRook(Color.White, { row: 4, column: 4 })
    const rook2 = createRook(Color.White, { row: 4, column: 5 })
    const board = createBoard([rook, rook2])
    const endingCoordinate = { row: 4, column: 6 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece not in the way bishop going up right", () => {
    const bishop = createBishop(Color.White, { row: 4, column: 4 })
    const board = createBoard([bishop])
    const endingCoordinate = { row: 8, column: 8 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way bishop going up left", () => {
    const bishop = createBishop(Color.White, { row: 4, column: 4 })
    const board = createBoard([bishop])
    const endingCoordinate = { row: 8, column: 1 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way bishop going down right", () => {
    const bishop = createBishop(Color.White, { row: 4, column: 4 })
    const board = createBoard([bishop])
    const endingCoordinate = { row: 1, column: 8 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way bishop going down left", () => {
    const bishop = createBishop(Color.White, { row: 4, column: 4 })
    const board = createBoard([bishop])
    const endingCoordinate = { row: 1, column: 1 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece in the way bishop going up right", () => {
    const bishop = createBishop(Color.White, { row: 4, column: 4 })
    const bishop2 = createBishop(Color.White, { row: 5, column: 5 })
    const board = createBoard([bishop, bishop2])
    const endingCoordinate = { row: 8, column: 8 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way bishop going up left", () => {
    const bishop = createBishop(Color.White, { row: 4, column: 4 })
    const bishop2 = createBishop(Color.White, { row: 5, column: 3 })
    const board = createBoard([bishop, bishop2])
    const endingCoordinate = { row: 8, column: 1 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way bishop going down right", () => {
    const bishop = createBishop(Color.White, { row: 4, column: 4 })
    const bishop2 = createBishop(Color.White, { row: 3, column: 5 })
    const board = createBoard([bishop, bishop2])
    const endingCoordinate = { row: 1, column: 8 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way bishop going down left", () => {
    const bishop = createBishop(Color.White, { row: 4, column: 4 })
    const bishop2 = createBishop(Color.White, { row: 3, column: 3 })
    const board = createBoard([bishop, bishop2])
    const endingCoordinate = { row: 1, column: 1 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

