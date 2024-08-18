import { expect, test } from "vitest";
import { type GameState, initGameState, tryMovePiece, setSelectedPieceForState, emptyBoard, Board, Coordinate, SelectedPiece, getBoardCell } from "../Game";
import { ActivePiece, Color } from "../pieces/ActivePiece";
import { Bishop } from "../pieces/Bishop";
import { Rook } from "../pieces/Rook";
import { Queen } from "../pieces/Queen";
import { createPawn } from "../pieces/Pawn";

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

const createGameState = (board: Board<ActivePiece>, selectedPiece: SelectedPiece | undefined, playerTurn: Color, inCheck: boolean): GameState => {
    return {
        board,
        selectedPiece,
        playerTurn,
        inCheck,
    }
}
function assertPieceNotMoved(oldGame: GameState, newGame: GameState, startCoordinate: Coordinate, endCoordinate: Coordinate, piece: ActivePiece, expectedPiece?: ActivePiece) {
    //piece shouldnt have moved
    expect(getBoardCell(newGame.board, endCoordinate)).toEqual(expectedPiece)
    expect(getBoardCell(newGame.board, startCoordinate)).toEqual(piece)

    //old board shouldn't have changed
    expect(getBoardCell(oldGame.board, endCoordinate)).toEqual(expectedPiece)
    expect(getBoardCell(oldGame.board, startCoordinate)).toEqual(piece)
}


function assertPieceMovedCorrectly(oldGame: GameState, newGame: GameState, startCoordinate: Coordinate, endCoordinate: Coordinate, piece: ActivePiece) {
    //piece shouldnt be in old coordinates for new board
    expect(getBoardCell(oldGame.board, endCoordinate)).toEqual(undefined)
    //piece should be in old coordinates for old board
    expect(getBoardCell(oldGame.board, startCoordinate)).toEqual(piece)

    //piece shouldn't be in old coordinates for new board
    expect(getBoardCell(newGame.board, endCoordinate)).toEqual(piece)
    //piece shouldn't be in old coordinates
    expect(getBoardCell(newGame.board, startCoordinate)).toEqual(undefined)
}

function selectAndMovePiece(game: GameState, startCoordinate: Coordinate, endCoordinate: Coordinate) {
    const gameWithSelectedPiece = setSelectedPieceForState(game, startCoordinate)

    return tryMovePiece(gameWithSelectedPiece, endCoordinate);
}

test("pawn can move twice if hasn't moved", () => {
    const startCoordinate = { row: 1, column: 1 }

    const pawn = createPawn(Color.White, startCoordinate)
    pawn.hasMoved = false

    const board = createBoard([
        pawn,
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 3, column: 1 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceMovedCorrectly(game, newGame, startCoordinate, endCoordinate, pawn)
});


test("pawn cant move twice if already moved", () => {
    const startCoordinate = { row: 1, column: 1 }

    const pawn = createPawn(Color.White, startCoordinate)
    pawn.hasMoved = true

    const board = createBoard([
        pawn,
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 3, column: 1 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(game, newGame, startCoordinate, endCoordinate, pawn)
});


test("pawn cant move ontop of another piece", () => {
    const startCoordinate = { row: 1, column: 1 }

    const pawn = createPawn(Color.White, startCoordinate)
    const rook = createRook(2, 1, Color.Black)

    const board = createBoard([
        pawn,
        rook
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 2, column: 1 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(game, newGame, startCoordinate, endCoordinate, pawn, rook)
});

test("pawn cant move diagnoally without taking an enemy piece", () => {
    const startCoordinate = { row: 1, column: 1 }

    const pawn = createPawn(Color.White, startCoordinate)

    const board = createBoard([
        pawn,
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 1, column: 2 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(game, newGame, startCoordinate, endCoordinate, pawn)
});

test("rook cant move through other pieces", () => {
    const startCoordinate = { row: 1, column: 1 }

    const rook = createRook(startCoordinate.row, startCoordinate.column, Color.White)
    const bishop = createBishop(1, 3, Color.White)

    const board = createBoard([
        rook,
        bishop
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 1, column: 6 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(game, newGame, startCoordinate, endCoordinate, rook)
});


test("bishop cant move through other pieces", () => {
    const startCoordinate = { row: 1, column: 1 }

    const bishop = createBishop(startCoordinate.row, startCoordinate.column, Color.White)
    const rook = createRook(3, 3, Color.White)

    const board = createBoard([
        bishop,
        rook
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 6, column: 6 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(game, newGame, startCoordinate, endCoordinate, bishop)
});


test("move piece happy path bishop", () => {
    const startCoordinate = { row: 1, column: 1 }
    const bishop = createBishop(startCoordinate.row, startCoordinate.column, Color.White)

    const board = createBoard([
        bishop
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 6, column: 6 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceMovedCorrectly(game, newGame, startCoordinate, endCoordinate, bishop)
});



test("move piece happy path rook", () => {
    const startCoordinate = { row: 1, column: 1 }
    const endCoordinate = { row: 6, column: 1 }

    const rook = createRook(startCoordinate.row, startCoordinate.column, Color.White)
    const board = createBoard([
        rook
    ])
    const game = createGameState(board, undefined, Color.White, false)
    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)
    assertPieceMovedCorrectly(game, newGame, startCoordinate, endCoordinate, rook)
});


test("move piece on own piece shouldn't move piece", () => {
    const game = initGameState();

    const gameWithSelectedPiece = setSelectedPieceForState(game, { row: 1, column: 1 })

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




