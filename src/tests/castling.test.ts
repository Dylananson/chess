import {expect, test} from 'vitest'
import { createKing } from '../pieces/King'
import { Color } from '../pieces/ActivePiece'
import { createRook, } from '../pieces/Rook'
import { createBoard } from '../Game'

test('castling', () => {
    const king = createKing(Color.White, { row: 0, column: 4 })
    const rook = createRook(Color.White, { row: 0, column: 0 })
    const board = createBoard(
        [king,rook]
    )
})
