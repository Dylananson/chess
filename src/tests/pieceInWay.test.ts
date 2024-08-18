import { expect, test } from "vitest";
import { ActivePiece, Coordinate, Board, emptyBoard, Color, isPieceInWay } from "../Board";
import { Queen } from "../pieces/Queen";
import { Rook } from "../pieces/Rook";
import { Bishop } from "../pieces/Bishop";

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
    }
}

const createRook = (row: number, column: number, color: Color) => {
    return {
        piece: Rook,
        color: color,
        id: coordToKey({ row, column }),
        startingCoordinate: { row, column },
    }
}

const createQueen = (row: number, column: number, color: Color) => {
    return {
        piece: Queen,
        color: color,
        id: coordToKey({ row, column }),
        startingCoordinate: { row, column },
    }
}

test("piece not in the way rook going right", () => {
    const rook = createRook(4, 4, Color.White)
    const board = createBoard([rook])
    const endingCoordinate = { row: 4, column: 8 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way rook going left", () => {
    const rook = createRook(4, 4, Color.White)
    const board = createBoard([rook])
    const endingCoordinate = { row: 4, column: 1 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})


test("piece not in the way rook going up", () => {
    const rook = createRook(4, 4, Color.White)
    const board = createBoard([rook])
    const endingCoordinate = { row: 8, column: 4 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way rook going down", () => {
    const rook = createRook(4, 4, Color.White)
    const board = createBoard([rook])
    const endingCoordinate = { row: 1, column: 4 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})


test("piece in the way rook going down", () => {
    const rook = createRook(4, 4, Color.White)
    const rook2 = createRook(3, 4, Color.White)
    const board = createBoard([rook, rook2])
    const endingCoordinate = { row: 1, column: 4 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way rook going up", () => {
    const rook = createRook(4, 4, Color.White)
    const rook2 = createRook(5, 4, Color.White)
    const board = createBoard([rook, rook2])
    const endingCoordinate = { row: 8, column: 4 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})


test("piece in the way rook going left", () => {
    const rook = createRook(4, 4, Color.White)
    const rook2 = createRook(4, 3, Color.White)
    const board = createBoard([rook, rook2])
    const endingCoordinate = { row: 4, column: 1 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way rook going right", () => {
    const rook = createRook(4, 4, Color.White)
    const rook2 = createRook(4, 5, Color.White)
    const board = createBoard([rook, rook2])
    const endingCoordinate = { row: 4, column: 6 }
    const pieceInWay = isPieceInWay(rook.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece not in the way bishop going up right", () => {
    const bishop = createBishop(4, 4, Color.White)
    const board = createBoard([bishop])
    const endingCoordinate = { row: 8, column: 8 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way bishop going up left", () => {
    const bishop = createBishop(4, 4, Color.White)
    const board = createBoard([bishop])
    const endingCoordinate = { row: 8, column: 1 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way bishop going down right", () => {
    const bishop = createBishop(4, 4, Color.White)
    const board = createBoard([bishop])
    const endingCoordinate = { row: 1, column: 8 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece not in the way bishop going down left", () => {
    const bishop = createBishop(4, 4, Color.White)
    const board = createBoard([bishop])
    const endingCoordinate = { row: 1, column: 1 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeFalsy()
})

test("piece in the way bishop going up right", () => {
    const bishop = createBishop(4, 4, Color.White)
    const bishop2 = createBishop(5, 5, Color.White)
    const board = createBoard([bishop, bishop2])
    const endingCoordinate = { row: 8, column: 8 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way bishop going up left", () => {
    const bishop = createBishop(4, 4, Color.White)
    const bishop2 = createBishop(5, 3, Color.White)
    const board = createBoard([bishop, bishop2])
    const endingCoordinate = { row: 8, column: 1 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way bishop going down right", () => {
    const bishop = createBishop(4, 4, Color.White)
    const bishop2 = createBishop(3, 5, Color.White)
    const board = createBoard([bishop, bishop2])
    const endingCoordinate = { row: 1, column: 8 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

test("piece in the way bishop going down left", () => {
    const bishop = createBishop(4, 4, Color.White)
    const bishop2 = createBishop(3, 3, Color.White)
    const board = createBoard([bishop, bishop2])
    const endingCoordinate = { row: 1, column: 1 }
    const pieceInWay = isPieceInWay(bishop.startingCoordinate, endingCoordinate, board)
    expect(pieceInWay).toBeTruthy()
})

