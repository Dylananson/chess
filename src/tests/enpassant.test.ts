import { test, expect } from 'vitest'
import { checkEnpassant } from '../model/GameState'
import { createPawn } from '../model/pieces/Pawn'
import { Color } from '../model/pieces/ActivePiece'
import { createRook } from '../model/pieces/Rook'

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
