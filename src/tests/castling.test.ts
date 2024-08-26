import { expect, test } from 'vitest'
import { Color } from '../model/pieces/ActivePiece'
import { createRook, } from '../model/pieces/Rook'
import { createKing } from '../model/pieces/King'
import { createBishop } from '../model/pieces/Bishop'
import { createBoardWithPieces } from '../model/Board'
import { createGameState } from '../model/GameState'

test('black castle rights king side', () => {
    const king = createKing(Color.Black, { row: 8, column: 5 })
    const rook = createRook(Color.Black, { row: 8, column: 8 })
    const board = createBoardWithPieces(
        [king, rook]
    )

    const canCastle = board.canCastleKingSide(Color.Black)

    expect(canCastle).toEqual(true)
})

test('black castle rights queen side', () => {
    const king = createKing(Color.Black, { row: 8, column: 5 })
    const rook = createRook(Color.Black, { row: 8, column: 1 })
    const board = createBoardWithPieces(
        [king, rook]
    )


    const canCastle = board.canCastleQueenSide(Color.Black)

    expect(canCastle).toEqual(true)
})

test('white castle rights king side', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const board = createBoardWithPieces(
        [king, rook]
    )

    const canCastle = board.canCastleKingSide(Color.White)

    expect(canCastle).toEqual(true)
})

test('white castle rights queen side', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const board = createBoardWithPieces(
        [king, rook]
    )

    const canCastle = board.canCastleQueenSide(Color.White)

    expect(canCastle).toEqual(true)
})


test('cant castle with piece in way kingside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const bishop = createBishop(Color.White, { row: 1, column: 6 })
    const board = createBoardWithPieces(
        [king, rook, bishop]
    )


    const canCastle = board.canCastleKingSide(Color.Black)

    expect(canCastle).toEqual(false)
})

test('cant castle with piece in way queenside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const bishop = createBishop(Color.White, { row: 1, column: 3 })
    const board = createBoardWithPieces(
        [king, rook, bishop]
    )

    const canCastle = board.canCastleQueenSide(Color.White)

    expect(canCastle).toEqual(false)
})


test('cant castle into attacked square queenside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const attackingRook = createRook(Color.Black, { row: 2, column: 2 })
    const board = createBoardWithPieces(
        [king, rook, attackingRook]
    )


    const canCastle = board.canCastleQueenSide(Color.White)

    expect(canCastle).toEqual(false)
})

test('cant castle into attacked square kingside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const attackingRook = createRook(Color.Black, { row: 2, column: 6 })
    const board = createBoardWithPieces(
        [king, rook, attackingRook]
    )


    const canCastle = board.canCastleKingSide(Color.White)

    expect(canCastle).toEqual(false)
})


test('cant while in check', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const checkingRook = createRook(Color.Black, { row: 2, column: 5 })
    const board = createBoardWithPieces(
        [king, rook, checkingRook]
    )

    const canCastle = board.canCastleKingSide(Color.White)

    expect(canCastle).toEqual(false)
})


test('castle queenside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const board = createBoardWithPieces(
        [king, rook]
    )

    const newBoard = board.castleQueenSide(Color.White)

    expect(newBoard.getPiece({ row: 1, column: 3 })).toEqual(king.move())
    expect(newBoard.getPiece({ row: 1, column: 4 })).toEqual(rook.move())
})


test('castle kingside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const board = createBoardWithPieces(
        [king, rook]
    )

    const newBoard = board.castleKingSide(Color.White)

    expect(newBoard.getPiece({ row: 1, column: 7 })).toEqual(king.move())
    expect(newBoard.getPiece({ row: 1, column: 6 })).toEqual(rook.move())
})

test('full test castle queenside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 1 })
    const board = createBoardWithPieces(
        [king, rook]
    )

    let game = createGameState(board, undefined, Color.White)
        .move({ row: 1, column: 5 }, { row: 1, column: 3 })

    expect(game.getPiece({ row: 1, column: 3 })).toEqual(king.move())
    expect(game.getPiece({ row: 1, column: 4 })).toEqual(rook.move())
})


test('full test castle kingside', () => {
    const king = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const board = createBoardWithPieces(
        [king, rook]
    )

    let game = createGameState(board, undefined, Color.White)
        .move({ row: 1, column: 5 }, { row: 1, column: 7 })

    expect(game.getPiece({ row: 1, column: 7 })).toEqual(king.move())
    expect(game.getPiece({ row: 1, column: 6 })).toEqual(rook.move())
})

