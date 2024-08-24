import { expect, test } from "vitest";
import { createBoard, type GameState, getInitGameState, tryMovePiece, selectPiece,  Board, Coordinate, SelectedPiece, getBoardCell } from "../Game";
import { ActivePiece, Color } from "../pieces/ActivePiece";
import { createBishop } from "../pieces/Bishop";
import { createRook } from "../pieces/Rook";
import { createPawn } from "../pieces/Pawn";
import { createKnight } from "../pieces/Knight";
import { createKing } from "../pieces/King";


export const createGameState = (board: Board<ActivePiece>, selectedPiece: SelectedPiece | undefined, playerTurn: Color, inCheck: boolean, history?: Array<Board<ActivePiece>>): GameState => {
    return {
        board,
        selectedPiece,
        playerTurn,
        inCheck,
        history: history ?? [board],
        historyIndex: 0
    }
}

function assertPieceNotMoved(newGame: GameState, startCoordinate: Coordinate, endCoordinate: Coordinate, piece: ActivePiece, expectedPiece?: ActivePiece) {
    //piece shouldnt have moved
    expect(getBoardCell(newGame.board, endCoordinate)).toEqual(expectedPiece)
    expect(getBoardCell(newGame.board, startCoordinate)).toEqual(piece)
    expect(newGame.playerTurn).toEqual(piece.color)
}


function assertPieceMovedCorrectly(newGame: GameState, startCoordinate: Coordinate, endCoordinate: Coordinate, piece: ActivePiece) {
    //piece shouldn't be in old coordinates for new board
    expect(getBoardCell(newGame.board, endCoordinate)).toEqual(piece)
    //piece shouldn't be in old coordinates
    expect(getBoardCell(newGame.board, startCoordinate)).toEqual(undefined)
}

export function selectAndMovePiece(game: GameState, startCoordinate: Coordinate, endCoordinate: Coordinate) {
    const gameWithSelectedPiece = selectPiece(game, startCoordinate)

    return tryMovePiece(gameWithSelectedPiece, endCoordinate);
}

test("cant move pinned piece", () => {
    const kingCoordinate = { row: 1, column: 1 }
    const rookCoordinate = { row: 1, column: 5 }
    const pinnedCoordinates = { row: 1, column: 3 }

    const king = createKing(Color.Black, kingCoordinate)
    const pinnedRook = createRook( Color.Black,{row:pinnedCoordinates.row,column: pinnedCoordinates.column})
    const rook = createRook( Color.White,{row:rookCoordinate.row,column: rookCoordinate.column})

    const board = createBoard([
        king,
        rook,
        pinnedRook
    ])

    const game = createGameState(board, undefined, Color.Black, false)

    const newGame = selectAndMovePiece(game, pinnedCoordinates, { row: 6, column: 3 })
    assertPieceNotMoved(newGame, pinnedCoordinates, { row: 6, column: 3 }, pinnedRook)
});


test("cant move other piece if in check", () => {
    const kingCoordinate = { row: 1, column: 1 }
    const rookCoordinate = { row: 2, column: 2 }
    const pawnCoordinate = { row: 7, column: 3 }

    const king = createKing(Color.Black, kingCoordinate)
    const pawn = createKing(Color.Black, pawnCoordinate)
    const rook = createRook( Color.White,{row:rookCoordinate.row,column: rookCoordinate.column})

    const board = createBoard([
        king,
        rook,
        pawn
    ])

    const game = createGameState(board, undefined, Color.White, false)

    const movedRookGame = selectAndMovePiece(game, rookCoordinate, { row: 1, column: 2 })
    assertPieceMovedCorrectly(movedRookGame, rookCoordinate, { row: 1, column: 2 }, rook)

    const movedPawnGame = selectAndMovePiece(movedRookGame, pawnCoordinate, { row: 6, column: 3 })
    assertPieceNotMoved(movedPawnGame, pawnCoordinate, { row: 6, column: 3 }, pawn)
});


test("king cant move into check", () => {
    const startCoordinate = { row: 1, column: 1 }

    const king = createKing(Color.White, startCoordinate)
    const rook = createRook( Color.Black,{row:2,column: 2})

    const board = createBoard([
        king,
        rook,
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 1, column: 2 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(newGame, startCoordinate, endCoordinate, king)
});


test("king cant move into check", () => {
    const startCoordinate = { row: 1, column: 1 }

    const king = createKing(Color.White, startCoordinate)
    const bishop = createRook( Color.Black,{row:2,column: 2})

    const board = createBoard([
        king,
        bishop,
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 1, column: 2 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(newGame, startCoordinate, endCoordinate, king)
});


test("king can take enemy piece", () => {
    const startCoordinate = { row: 1, column: 1 }

    const king = createKing(Color.White, startCoordinate)
    const bishop = createBishop(1, 2, Color.Black)

    const board = createBoard([
        king,
        bishop,
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 1, column: 2 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceMovedCorrectly(newGame, startCoordinate, endCoordinate, king)
});

test("king cant move on same color piece", () => {
    const startCoordinate = { row: 1, column: 1 }

    const king = createKing(Color.White, startCoordinate)
    const bishop = createBishop(1, 2, Color.White)

    const board = createBoard([
        king,
        bishop,
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 1, column: 2 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(newGame, startCoordinate, endCoordinate, king, bishop)
});


test("knight can move over pieces", () => {
    const startCoordinate = { row: 1, column: 1 }

    const knight = createKnight(Color.White, startCoordinate)
    const bishop = createBishop(1, 3, Color.White)
    const pawn = createPawn( Color.White, {row: 2, column: 2})

    const board = createBoard([
        knight,
        bishop,
        pawn
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 3, column: 2 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceMovedCorrectly(newGame, startCoordinate, endCoordinate, knight)
});

test("pawn can move twice if hasn't moved", () => {
    const startCoordinate = { row: 1, column: 1 }

    const pawn = createPawn(Color.White, startCoordinate)

    const board = createBoard([
        pawn,
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 3, column: 1 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceMovedCorrectly(newGame, startCoordinate, endCoordinate, pawn)
});


test("pawn cant move twice if already moved", () => {
    const startCoordinate = { row: 1, column: 1 }

    const pawn = createPawn(Color.White, startCoordinate)
    const blackPawn = createPawn(Color.Black, { row: 8, column: 1 })

    const board = createBoard([
        pawn,
        blackPawn
    ])

    const game = createGameState(board, undefined, Color.White, false)

    const nextCoordinate = { row: 3, column: 1 }
    const movedPawnGame = selectAndMovePiece(game, startCoordinate, nextCoordinate)

    const whiteTurnGame = selectAndMovePiece(movedPawnGame, { row: 8, column: 1 }, { row: 7, column: 1 })

    const endCoordinate = { row: 6, column: 1 }
    const newGame = selectAndMovePiece(whiteTurnGame, startCoordinate, endCoordinate)

    assertPieceNotMoved(newGame, nextCoordinate, endCoordinate, pawn)
});


test("pawn cant move ontop of another piece", () => {
    const startCoordinate = { row: 1, column: 1 }

    const pawn = createPawn(Color.White, startCoordinate)
    const rook = createRook( Color.Black,{row:2,column: 1})

    const board = createBoard([
        pawn,
        rook
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 2, column: 1 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(newGame, startCoordinate, endCoordinate, pawn, rook)
});

test("pawn can take enemy piece", () => {
    const startCoordinate = { row: 1, column: 1 }
    const endCoordinate = { row: 2, column: 2 }

    const pawn = createPawn(Color.White, startCoordinate)
    const rook = createRook( Color.Black,{row:endCoordinate.row,column: endCoordinate.column})

    const board = createBoard([
        pawn,
        rook
    ])

    const game = createGameState(board, undefined, Color.White, false)

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceMovedCorrectly(newGame, startCoordinate, endCoordinate, pawn)
});


test("pawn cant take own piece", () => {
    const startCoordinate = { row: 1, column: 1 }

    const pawn = createPawn(Color.White, startCoordinate)
    const rook = createRook( Color.White,{row:2,column: 2})

    const board = createBoard([
        pawn,
        rook
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 2, column: 2 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(newGame, startCoordinate, endCoordinate, pawn, rook)
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

    assertPieceNotMoved(newGame, startCoordinate, endCoordinate, pawn)
});

test("rook cant move through other pieces", () => {
    const startCoordinate = { row: 1, column: 1 }

    const rook = createRook( Color.White,{row:startCoordinate.row,column: startCoordinate.column})
    const bishop = createBishop(1, 3, Color.White)

    const board = createBoard([
        rook,
        bishop
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 1, column: 6 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(newGame, startCoordinate, endCoordinate, rook)
});


test("bishop cant move through other pieces", () => {
    const startCoordinate = { row: 1, column: 1 }

    const bishop = createBishop(startCoordinate.row, startCoordinate.column, Color.White)
    const rook = createRook( Color.White,{row: 3, column: 3})

    const board = createBoard([
        bishop,
        rook
    ])

    const game = createGameState(board, undefined, Color.White, false)
    const endCoordinate = { row: 6, column: 6 }

    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)

    assertPieceNotMoved(newGame, startCoordinate, endCoordinate, bishop)
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

    assertPieceMovedCorrectly(newGame, startCoordinate, endCoordinate, bishop)
});



test("move piece happy path rook", () => {
    const startCoordinate = { row: 1, column: 1 }
    const endCoordinate = { row: 6, column: 1 }

    const rook = createRook( Color.White,{row:startCoordinate.row,column: startCoordinate.column})
    const board = createBoard([
        rook
    ])
    const game = createGameState(board, undefined, Color.White, false)
    const newGame = selectAndMovePiece(game, startCoordinate, endCoordinate)
    assertPieceMovedCorrectly(newGame, startCoordinate, endCoordinate, rook)
});


test("move piece on own piece shouldn't move piece", () => {
    const game = getInitGameState();

    const gameWithSelectedPiece = selectPiece(game, { row: 1, column: 1 })

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




