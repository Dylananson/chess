import { expect, test } from "vitest";
import { ActivePiece, Coordinate, Board, emptyBoard, Rook, Color, RookMoves, isOnBoard, Bishop, filterBlockingMoves, Queen, QueenMoves, isPieceInWay } from "../Board";
import { bishopMoves } from "../moves";

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


test("should be blocked horizontal rook", () => {
    const rook1 = createRook(2, 4, Color.White)
    const rook2 = createRook(2, 5, Color.White)

    const board = createBoard([rook1, rook2])

    const validMoves = RookMoves(rook1.startingCoordinate)

    const filtered = filterBlockingMoves(rook1.startingCoordinate, validMoves, board)

    expect(filtered?.map(coordToKey).sort()).toEqual([
        "21",
        "22",
        "23",

        "14",
        "34",
        "44",
        "54",
        "64",
        "74",
        "84",
    ].sort())
});


test("shouldn't be blocked rook", () => {
    const rook1 = createRook(4, 4, Color.White)
    const rook2 = createRook(5, 5, Color.White)
    const rook3 = createRook(6, 6, Color.White)
    const rook4 = createRook(3, 3, Color.White)

    const board = createBoard([rook1, rook2, rook3, rook4])

    const validMoves = RookMoves(rook1.startingCoordinate)

    const filtered = filterBlockingMoves(rook1.startingCoordinate, validMoves, board)

    expect(filtered?.map(coordToKey).sort()).toEqual(validMoves.map(coordToKey).sort())
});


test("shouldn't be blocked rook 2", () => {
    const rook1 = createRook(3, 3, Color.White)

    const rook2 = createRook(2, 2, Color.White)
    const rook3 = createRook(4, 4, Color.White)

    const board = createBoard([rook1, rook2, rook3])

    const validMoves = RookMoves(rook1.startingCoordinate)
    const filtered = filterBlockingMoves(rook1.startingCoordinate, validMoves, board)

    expect(filtered?.map(coordToKey).sort()).toEqual(validMoves.map(coordToKey).sort())
});

test("completely blocked path rooks", () => {
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


    board[3][3] = rook1

    board[4][3] = rook2
    board[2][3] = rook2
    board[3][4] = rook2
    board[3][2] = rook2

    const pieceCoordinates = { row: 4, column: 4 };
    const validMoves = RookMoves(pieceCoordinates)

    const filtered = filterBlockingMoves({ row: 4, column: 4 }, validMoves, board)

    expect(filtered?.map(x => `${x.row}${x.column}`).sort()).toEqual([
    ].sort())
});


const addPieceToBoard = (board: Board<ActivePiece>, piece: ActivePiece, coordinates: Coordinate) => {
    return board[coordinates.row - 1][coordinates.column - 1] = piece
}


test("happy path rooks", () => {
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

    const pieceCoordinates = { row: 4, column: 4 };
    board[pieceCoordinates.row - 1][pieceCoordinates.column - 1] = rook1

    addPieceToBoard(board, rook2, { row: 6, column: 4 })
    addPieceToBoard(board, rook2, { row: 2, column: 4 })

    const validMoves = RookMoves(pieceCoordinates)

    const filtered = filterBlockingMoves(pieceCoordinates, validMoves, board)

    expect(filtered?.map(x => `${x.row}${x.column}`).sort()).toEqual([
        "34",
        "54",
        "41",
        "42",
        "43",
        "45",
        "46",
        "47",
        "48",
    ].sort())
});



test("completly blocked path bishops", () => {
    const board: Board<ActivePiece> = emptyBoard()
    const bishop1: ActivePiece = {
        piece: Bishop,
        color: Color.White,
        id: "bishop1",
        startingCoordinate: { row: 1, column: 1 },
    }

    const bishop2: ActivePiece = {
        piece: Bishop,
        color: Color.White,
        id: "bishop2",
        startingCoordinate: { row: 2, column: 1 },
    }

    const bishop3: ActivePiece = {
        piece: Bishop,
        color: Color.White,
        id: "bishop3",
        startingCoordinate: { row: 2, column: 1 },
    }

    const pieceCoordinate = { row: 4, column: 4 }

    board[pieceCoordinate.row - 1][pieceCoordinate.column - 1] = bishop1

    board[4][4] = bishop2
    board[2][2] = bishop3
    board[2][4] = bishop3
    board[4][2] = bishop3

    const validMoves = bishopMoves(pieceCoordinate)

    const filtered = filterBlockingMoves(pieceCoordinate, validMoves, board)

    expect(filtered?.map(x => `${x.row}${x.column}`).sort()).toEqual([
    ].sort())
});


