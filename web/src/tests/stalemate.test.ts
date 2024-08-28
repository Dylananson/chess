import { expect, test } from 'vitest';
import { isStalemate, createBoardWithPieces } from '../model/Board';

import { createKing } from '../model/pieces/King';
import { Color } from '../model/pieces/ActivePiece';
import { createRook } from '../model/pieces/Rook';

test("stalemate happy path", () => {

    const board = createBoardWithPieces([
        createKing(Color.Black, { row: 1, column: 1 }),
        createRook(Color.White, { row: 3, column: 2 }),
        createKing(Color.White, { row: 3, column: 1 }),
    ])

    expect(board.isStalemate(Color.Black)).toEqual(true);
})


test("not stalemate if checked", () => {
    const board = createBoardWithPieces([
        createKing(Color.Black, { row: 1, column: 1 }),
        createRook(Color.White, { row: 3, column: 2 }),
        createRook(Color.White, { row: 1, column: 2 }),
        createKing(Color.White, { row: 3, column: 1 }),
    ])

    expect(board.isStalemate(Color.Black)).toEqual(false);
})

