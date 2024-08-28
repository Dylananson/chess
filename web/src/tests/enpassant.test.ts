import { test, expect } from 'vitest'
import { checkEnpassant, createGameState } from '../model/GameState'
import { createPawn } from '../model/pieces/Pawn'
import { Color } from '../model/pieces/ActivePiece'
import { createRook } from '../model/pieces/Rook'
import { createBoardWithPieces } from '../model/Board'

test("enpassant works for black pawn", () => {
    const pawn = createPawn(Color.Black, { row: 7, column: 4 })

    const enpassant = checkEnpassant(pawn, { row: 7, column: 4 }, { row: 5, column: 4 })

    expect(enpassant).toEqual({ row: 6, column: 4 })
})


test("enpassant works for white pawn", () => {
    const pawn = createPawn(Color.White, { row: 2, column: 4 })

    const enpassant = checkEnpassant(pawn, { row: 2, column: 4 }, { row: 4, column: 4 })

    expect(enpassant).toEqual({ row: 3, column: 4 })
})


test("enpassant returns undefined if pawn doesn't move twice", () => {
    const pawn = createPawn(Color.White, { row: 2, column: 4 })

    const enpassant = checkEnpassant(pawn, { row: 3, column: 4 }, { row: 4, column: 4 })

    expect(enpassant).toEqual(undefined)
})


test("enpassant returns undefined if not pawn", () => {
    const rook = createRook(Color.White, { row: 2, column: 4 })

    const enpassant = checkEnpassant(rook, { row: 3, column: 4 }, { row: 4, column: 4 })

    expect(enpassant).toEqual(undefined)
})


test("enpassant capture left white", () => {
    const blackPawn = createPawn(Color.Black, { row: 7, column: 4 })
    const whitePawn = createPawn(Color.White, { row: 4, column: 3 })

    let game = createGameState(createBoardWithPieces([
        blackPawn,
        whitePawn,
    ]), undefined, Color.Black)

    game = game.move({row:7, column:4}, {row:5, column:4})
    const enpassant = game.enpassant

    expect(enpassant).toEqual({ row: 6, column: 4 })

    game = game.move({row:4, column:3}, {row:5, column:4})

    expect(game.board.getPiece({row:6, column:4})).toEqual(undefined)
    expect(game.board.getPiece({row:5, column:4})).toEqual({...whitePawn, hasMoved:true})
})

test("enpassant capture right white", () => {
    const blackPawn = createPawn(Color.Black, { row: 7, column: 2})
    const whitePawn = createPawn(Color.White, { row: 4, column: 3 })

    let game = createGameState(createBoardWithPieces([
        blackPawn,
        whitePawn,
    ]), undefined, Color.Black)

    game = game.move({row:7, column:2}, {row:5, column:2})
    const enpassant = game.enpassant

    expect(enpassant).toEqual({ row: 6, column: 2 })

    game = game.move({row:4, column:3}, {row:5, column:2})

    expect(game.board.getPiece({row:6, column:2})).toEqual(undefined)
    expect(game.board.getPiece({row:5, column:2})).toEqual({...whitePawn, hasMoved:true})
})

test("enpassant capture right black", () => {
    const blackPawn = createPawn(Color.Black, { row: 4, column: 2})
    const whitePawn = createPawn(Color.White, { row: 2, column: 3 })

    let game = createGameState(createBoardWithPieces([
        blackPawn,
        whitePawn,
    ]), undefined, Color.White)

    game = game.move({row:2, column:3}, {row:4, column:3})
    const enpassant = game.enpassant

    expect(enpassant).toEqual({ row: 3, column: 3 })

    game = game.move({row:4, column:2}, {row:3, column:3})

    expect(game.board.getPiece({row:4, column:2})).toEqual(undefined)
    expect(game.board.getPiece({row:3, column:3})).toEqual({...blackPawn, hasMoved:true})
})


test("enpassant capture left black", () => {
    const blackPawn = createPawn(Color.Black, { row: 4, column: 4})
    const whitePawn = createPawn(Color.White, { row: 2, column: 3 })

    let game = createGameState(createBoardWithPieces([
        blackPawn,
        whitePawn,
    ]), undefined, Color.White)

    game = game.move({row:2, column:3}, {row:4, column:3})
    const enpassant = game.enpassant

    expect(enpassant).toEqual({ row: 3, column: 3 })

    game = game.move({row:4, column:4}, {row:3, column:3})

    expect(game.board.getPiece({row:4, column:2})).toEqual(undefined)
    expect(game.board.getPiece({row:3, column:3})).toEqual({...blackPawn, hasMoved:true})
})

test("dont if valid piece didn't move twice", () => {
    const blackPawn = createPawn(Color.Black, { row: 5, column: 4})
    const whitePawn = createPawn(Color.White, { row: 2, column: 3 })

    let game = createGameState(createBoardWithPieces([
        blackPawn,
        whitePawn,
    ]), undefined, Color.White)

    //move white pawn
    game = game.move({row:2, column:3}, {row:3, column:3})

    //move black pawn
    game = game.move({row:5, column:4}, {row:4, column:4})


    //move white pawn
    game = game.move({row:3, column:3}, {row:4, column:3})

    //try to take with enpassant
    game = game.move({row:4, column:4}, {row:3, column:3})

    //white pawn should still exist
    expect(game.board.getPiece({row:4, column:3})).toEqual(whitePawn.move())

    //black pawn shouldnt have moved to take white pawn
    expect(game.board.getPiece({row:4, column:4})).toEqual(blackPawn.move())


    //should be no piece in enpassant position
    expect(game.board.getPiece({row:3, column:3})).toEqual(undefined)
})
