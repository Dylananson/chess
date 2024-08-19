import { expect, test } from 'vitest';
import { createBoard, isCheck } from '../Game';
import { createKing } from '../pieces/King';
import { Color } from '../pieces/ActivePiece';
import { createGameState } from './movePiece.test';
import { createQueen } from '../pieces/Queen';
import { createPawn } from '../pieces/Pawn';
import { createKnight } from '../pieces/Knight';

test("is in check happy path", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 2, column: 1 });

    const board = createBoard([
        king,
        queen
    ])

    const game = createGameState(board, undefined, Color.Black, false)


    game.playerTurn = Color.Black

    const checked = isCheck(game.board, Color.Black)

    expect(checked).toEqual(true);
});

test("not in check if hit by same color", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const knight = createKnight(Color.Black, { row: 3, column: 2 });

    const board = createBoard([
        king,
        knight,
    ])

    const game = createGameState(board, undefined, Color.Black, false)

    game.playerTurn = Color.Black

    const checked = isCheck(game.board, Color.Black)

    expect(checked).toEqual(false);
});


test("in check if hit by knight with pieces in way", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const knight = createKnight(Color.White, { row: 3, column: 2 });
    const pawn = createPawn(Color.Black, { row: 2, column: 1 });
    const pawn1 = createPawn(Color.Black, { row: 2, column: 2 });
    const pawn2 = createPawn(Color.Black, { row: 2, column: 3 });
    const pawn3 = createPawn(Color.Black, { row: 1, column: 2 });

    const board = createBoard([
        king,
        knight,
        pawn,
        pawn1,
        pawn2,
        pawn3
    ])

    const game = createGameState(board, undefined, Color.Black, false)

    game.playerTurn = Color.Black

    const checked = isCheck(game.board, Color.Black)

    expect(checked).toEqual(true);
});


test("not in check if piece blocked", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.White, { row: 3, column: 1 });
    const pawn = createPawn(Color.White, { row: 2, column: 1 });

    const board = createBoard([
        king,
        queen,
        pawn
    ])

    const game = createGameState(board, undefined, Color.Black, false)


    game.playerTurn = Color.Black

    const checked = isCheck(game.board, Color.Black)

    expect(checked).toEqual(false);
});

