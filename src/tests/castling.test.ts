import { expect, test } from 'vitest'
import { Color } from '../pieces/ActivePiece'
import { createRook, } from '../pieces/Rook'
import { canCastleQueenSide, canCastleKingSide, castleKingSide, castleQueenSide } from '../Game'
import { getBoardCell, createBoard } from '../Board'
import { createKing } from '../pieces/King'
import { createBishop } from '../pieces/Bishop'

test('black castle rights king side', () => {
    const king = createKing(Color.Black, { row: 8, column: 5 })
    const rook = createRook(Color.Black, { row: 8, column: 8 })
    const board = createBoard(
        [king, rook]
    )

    const canCastle = canCastleKingSide(board, Color.Black)

    expect(canCastle).toEqual(true)
})

test('black castle rights queen side', () => {
    const king = createKing(Color.Black, { row: 8, column: 5 })
    const rook = createRook(Color.Black, { row: 8, column: 1 })
    const board = createBoard(
        [king, rook]
    )


    const canCastle = canCastleQueenSide(board, Color.Black)

    expect(canCastle).toEqual(true)
})

test('white castle rights king side', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const board = createBoard(
        [king, rook]
    )

    const canCastle = canCastleKingSide(board, Color.White)

    expect(canCastle).toEqual(true)
})

test('white castle rights queen side', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const board = createBoard(
        [king, rook]
    )

    const canCastle = canCastleQueenSide(board, Color.White)

    expect(canCastle).toEqual(true)
})


test('cant castle with piece in way kingside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const bishop = createBishop(Color.White, { row: 1, column: 6 })
    const board = createBoard(
        [king, rook, bishop]
    )


    const canCastle = canCastleKingSide(board, Color.Black)

    expect(canCastle).toEqual(false)
})

test('cant castle with piece in way queenside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const bishop = createBishop(Color.White, { row: 1, column: 3 })
    const board = createBoard(
        [king, rook, bishop]
    )

    const canCastle = canCastleQueenSide(board, Color.White)

    expect(canCastle).toEqual(false)
})


test('cant castle into attacked square queenside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const attackingRook = createRook(Color.Black, { row: 2, column: 2 })
    const board = createBoard(
        [king, rook, attackingRook]
    )


    const canCastle = canCastleQueenSide(board, Color.White)

    expect(canCastle).toEqual(false)
})

test('cant castle into attacked square kingside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const attackingRook = createRook(Color.Black, { row: 2, column: 6 })
    const board = createBoard(
        [king, rook, attackingRook]
    )


    const canCastle = canCastleKingSide(board, Color.White)

    expect(canCastle).toEqual(false)
})


test('cant while in check', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const checkingRook = createRook(Color.Black, { row: 2, column: 5 })
    const board = createBoard(
        [king, rook, checkingRook]
    )

    const canCastle = canCastleKingSide(board, Color.White)

    expect(canCastle).toEqual(false)
})


test('castle queenside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const board = createBoard(
        [king, rook]
    )

    const newBoard = castleQueenSide(board, Color.White)

    expect(newBoard[0][2]).toEqual(king.move())
    expect(newBoard[0][3]).toEqual(rook.move())
})


test('castle kingside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const board = createBoard(
        [king, rook]
    )

    const newBoard = castleKingSide(board, Color.White)

    expect(getBoardCell(newBoard, { row: 1, column: 7 })).toEqual(king.move())
    expect(getBoardCell(newBoard, { row: 1, column: 6 })).toEqual(rook.move())
})



