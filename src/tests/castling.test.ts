import {expect, test} from 'vitest'
import { Color } from '../pieces/ActivePiece'
import { createRook, } from '../pieces/Rook'
import { createBoard, hasCastlingRights } from '../Game'
import {createKing} from '../pieces/King'
import { createBishop } from '../pieces/Bishop'

test('black castle rights king side', () => {
    const king = createKing(Color.Black, { row: 8, column: 5 })
    const rook = createRook(Color.Black, { row: 8, column: 1 })
    const board = createBoard(
        [king, rook]
    )

 
    const canCastle = hasCastlingRights(king, rook, board)

    expect(canCastle).toEqual(true)
})

test('black castle rights queen side', () => {
    const king = createKing(Color.Black, { row: 8, column: 5 })
    const rook = createRook(Color.Black, { row: 8, column: 8 })
    const board = createBoard(
        [king, rook]
    )

 
    const canCastle = hasCastlingRights(king, rook, board)

    expect(canCastle).toEqual(true)
})

test('white castle rights king side', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const board = createBoard(
        [king, rook]
    )

 
    const canCastle = hasCastlingRights(king, rook, board)

    expect(canCastle).toEqual(true)
})

test('white castle rights queen side', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const board = createBoard(
        [king, rook]
    )

 
    const canCastle = hasCastlingRights(king, rook, board)

    expect(canCastle).toEqual(true)
})

test('cant castle with piece in way', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const bishop = createBishop(Color.White, { row: 1, column: 6 })
    const board = createBoard(
        [king, rook]
    )

 
    const canCastle = hasCastlingRights(king, rook, board)


    })

