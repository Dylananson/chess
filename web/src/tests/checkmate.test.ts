import { expect, test } from 'vitest';
import { createBoardWithPieces } from '../model/Board';
import { createKing } from '../model/pieces/King';
import { Color } from '../model/pieces/ActivePiece';
import { createQueen } from '../model/pieces/Queen';

test("checkmate happy path", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 2, column: 1 });
    const queen2 = createQueen(Color.White, { row: 2, column: 2 });

    const board = createBoardWithPieces([
        king,
        queen,
        queen2
    ])

    const checkmate = board.isCheckMate(Color.Black)

    expect(checkmate).toEqual(true);
})


test("not checkmate if can take", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 2, column: 1 });

    const board = createBoardWithPieces([
        king,
        queen,
    ])

    const checkmate = board.isCheckMate(Color.Black)

    expect(checkmate).toEqual(false);
})



test("checkmate if checking piece protected", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 2, column: 1 });
    const queen2 = createQueen(Color.White, { row: 3, column: 1 });

    const board = createBoardWithPieces([
        king,
        queen,
        queen2
    ])

    const checkmate = board.isCheckMate(Color.Black)

    expect(checkmate).toEqual(true);
})
