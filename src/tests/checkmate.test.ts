import { expect, test } from 'vitest';
import { createBoard, isCheckMate } from '../Game';
import { createKing } from '../pieces/King';
import { Color } from '../pieces/ActivePiece';
import { createQueen } from '../pieces/Queen';

test("checkmate happy path", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 2, column: 1 });
    const queen2 = createQueen(Color.White, { row: 2, column: 2 });

    const board = createBoard([
        king,
        queen,
        queen2
    ])

    const checkmate = isCheckMate(board, Color.Black)

    expect(checkmate).toEqual(true);
})


test("not checkmate if can take", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 2, column: 1 });

    const board = createBoard([
        king,
        queen,
    ])

    const checkmate = isCheckMate(board, Color.Black)

    expect(checkmate).toEqual(false);
})



test("checkmate if checking piece protected", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 2, column: 1 });
    const queen2 = createQueen(Color.White, { row: 3, column: 1 });

    const board = createBoard([
        king,
        queen,
        queen2
    ])

    const checkmate = isCheckMate(board, Color.Black)

    expect(checkmate).toEqual(true);
})
