import { test, expect } from 'vitest'
import { PromotingPawnGame, promotingPawnGameState } from '../utils/gameStates'
import { createPawn } from '../pieces/Pawn'
import { createKing } from '../pieces/King'
import { Color } from '../pieces/ActivePiece'
import { createBoardWithPieces } from '../Board'
import { createGameState } from '../GameState'
import { PieceName } from '../pieces/PieceName'

test('promotion', () => {
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
