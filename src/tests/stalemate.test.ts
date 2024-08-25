import { expect, test } from 'vitest';
import { isStalemate, createBoard } from '../Board';

import { createKing } from '../pieces/King';
import { Color } from '../pieces/ActivePiece';
import { createRook } from '../pieces/Rook';

test("stalemate happy path", () => {

    const board = createBoard([
        createKing(Color.Black, { row: 1, column: 1 }),
        createRook(Color.White, { row: 3, column: 2 }),
        createKing(Color.White, { row: 3, column: 1 }),
    ])

    expect(board.isStalemate(Color.Black)).toEqual(true);
})


test("not stalemate if checked", () => {
    const board = createBoard([
        createKing(Color.Black, { row: 1, column: 1 }),
        createRook(Color.White, { row: 3, column: 2 }),
        createRook(Color.White, { row: 1, column: 2 }),
        createKing(Color.White, { row: 3, column: 1 }),
    ])

    expect(board.isStalemate(Color.Black)).toEqual(false);
})

