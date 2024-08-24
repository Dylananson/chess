import { expect, test } from 'vitest';
import { filterPieceMovesThatPutKingInCheck, isCheck } from '../Game';
import { createBoard } from '../Board';
import { createKing } from '../pieces/King';
import { Color } from '../pieces/ActivePiece';
import { createGameState } from './movePiece.test';
import { createQueen } from '../pieces/Queen';
import { createPawn } from '../pieces/Pawn';
import { createKnight } from '../pieces/Knight';

test("filter out moves that put king in check shouldnt filter ", () => {
    const king = createKing(Color.Black, { row: 1, column: 1 });
    const queen = createQueen(Color.Black, { row: 2, column: 1 });

    const board = createBoard([
        king,
        queen
    ])

    const gameState = createGameState(board, undefined, Color.Black, false)

    const coordinate = { row: 1, column: 1 }

    const moves = king.piece.moves(gameState.board, coordinate)
    
    const filteredMoves = filterPieceMovesThatPutKingInCheck(gameState.board, coordinate, moves)

    expect(filteredMoves.length).toEqual(moves.length);
})

test("dont filter when king can take piece", () => {
    const kingCoordinate = { row: 1, column: 1 }

    const king = createKing(Color.Black, kingCoordinate);
    const queen = createQueen(Color.White, { row: 2, column: 1 });

    const board = createBoard([
        king,
        queen
    ])

    const gameState = createGameState(board, undefined, Color.Black, false)

    const moves = king.piece.moves(gameState.board, kingCoordinate)
    
    const filteredMoves = filterPieceMovesThatPutKingInCheck(board, kingCoordinate, moves)

    expect(filteredMoves.length).toEqual(1);
    expect(filteredMoves[0].row).toEqual(2);
    expect(filteredMoves[0].column).toEqual(1);
})

test("filter out moves that put king in check happy path", () => {
    const kingCoordinate = { row: 1, column: 1 }

    const king = createKing(Color.Black, kingCoordinate);
    const queen = createQueen(Color.White, { row: 3, column: 1 });
    const queen2 = createQueen(Color.White, { row: 3, column: 2 });

    const board = createBoard([
        king,
        queen,
        queen2
    ])

    const gameState = createGameState(board, undefined, Color.Black, false)

    const moves = king.piece.moves(gameState.board, kingCoordinate)
    
    const filteredMoves = filterPieceMovesThatPutKingInCheck(board, kingCoordinate, moves)

    expect(filteredMoves.length).toEqual(0);
})


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

