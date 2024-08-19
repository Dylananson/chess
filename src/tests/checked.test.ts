import { expect, test } from 'vitest';
import { createBoard, isCheck } from '../Game';
import { createKing } from '../pieces/King';
import { Color } from '../pieces/ActivePiece';
import { createGameState } from './movePiece.test';
import { createQueen } from '../pieces/Queen';

test("is in check happy path", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 2, column: 1 });

    const board = createBoard([
        king,
        queen
    ])

    const game = createGameState(board, undefined, Color.Black, false)


    game.playerTurn = Color.Black

    const checked = isCheck(game, Color.Black)

    expect(checked).toEqual(true);
});
