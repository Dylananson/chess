import { test, expect } from 'vitest'
import { createPawn } from '../model/pieces/Pawn'
import { createKing } from '../model/pieces/King'
import { Color } from '../model/pieces/ActivePiece'
import { createBoardWithPieces } from '../model/Board'
import { createGameState } from '../model/GameState'
import { PieceName } from '../model/pieces/PieceName'

test('promotion happy path black', () => {
    const pawn = createPawn(Color.Black, { row: 2, column: 1 })
    const blackKing = createKing(Color.Black, { row: 8, column: 5 })
    const whiteKing = createKing(Color.White, { row: 1, column: 5 })

    const b = createBoardWithPieces([pawn, blackKing, whiteKing])

    let game = createGameState(b, undefined, Color.Black)

    expect(game.history.length).toEqual(1)

    game = game
        .move({ row: 2, column: 1 }, { row: 1, column: 1 })
        .promotePawn({ row: 1, column: 1 }, PieceName.Queen)

    expect(game.getPiece({ row: 1, column: 1 })?.piece.name).toEqual(PieceName.Queen)
    expect(game.history.length).toEqual(2)
    expect(game.historyIndex).toEqual(1)
})


test('promotion happy path white', () => {
    const pawn = createPawn(Color.White, { row: 7, column: 1 })
    const blackKing = createKing(Color.Black, { row: 8, column: 5 })
    const whiteKing = createKing(Color.White, { row: 1, column: 5 })

    const b = createBoardWithPieces([pawn, blackKing, whiteKing])

    let game = createGameState(b, undefined, Color.White)

    expect(game.history.length).toEqual(1)

    game = game
        .move({ row: 7, column: 1 }, { row: 8, column: 1 })
        .promotePawn({ row: 8, column: 1 }, PieceName.Queen)

    expect(game.getPiece({ row: 8, column: 1 })?.piece.name).toEqual(PieceName.Queen)
    expect(game.history.length).toEqual(2)
    expect(game.historyIndex).toEqual(1)
})

test('shouldnt promote if not at end', () => {
    const pawn = createPawn(Color.White, { row: 7, column: 1 })
    const blackKing = createKing(Color.Black, { row: 8, column: 5 })
    const whiteKing = createKing(Color.White, { row: 1, column: 5 })

    const b = createBoardWithPieces([pawn, blackKing, whiteKing])

    let game = createGameState(b, undefined, Color.White)

    expect(game.history.length).toEqual(1)

    game = game
        .move({ row: 6, column: 1 }, { row: 7, column: 1 })
        .promotePawn({ row: 8, column: 1 }, PieceName.Queen)

    expect(game.getPiece({ row: 7, column: 1 })?.piece.name).toEqual(PieceName.Pawn)
    expect(game.getPiece({ row: 8, column: 1 })?.piece.name).toBeFalsy()
    expect(game.history.length).toEqual(1)
    expect(game.historyIndex).toEqual(0)
})
