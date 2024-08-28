import { expect, test } from "vitest";
import { createQueen } from "../model/pieces/Queen";
import { createBishop } from "../model/pieces/Bishop";
import { KnightMoves } from "../model/pieces/Knight";
import { createRook } from "../model/pieces/Rook";
import { emptyBoard, createBoardWithPieces } from "../model/Board";
import { Color } from "../model/pieces/ActivePiece";

test("bishop moves works", () => {
    const coordinates = { row: 1, column: 1 };
    const bishop = createBishop( Color.White,{row:coordinates.row,column: coordinates.column});
    const board = createBoardWithPieces([
        bishop
    ])
    const moves = bishop.piece.moves(board.board, coordinates)

    expect(moves).toEqual([
        { row: 2, column: 2 },
        { row: 3, column: 3 },
        { row: 4, column: 4 },
        { row: 5, column: 5 },
        { row: 6, column: 6 },
        { row: 7, column: 7 },
        { row: 8, column: 8 },
    ]);
});

test("knight moves works", () => {
    const moves = KnightMoves(emptyBoard(), { row: 4, column: 4 });

    expect(moves.map((a) => `${a.row}${a.column}`).sort()).toEqual(
        [
            { row: 6, column: 5 },
            { row: 6, column: 3 },
            { row: 2, column: 5 },
            { row: 2, column: 3 },

            { row: 3, column: 6 },
            { row: 5, column: 6 },
            { row: 3, column: 2 },
            { row: 5, column: 2 },
        ]
            .map((a) => `${a.row}${a.column}`)
            .sort(),
    );
});

test("knight moves works at starting pos 8,3", () => {
    const moves = KnightMoves(emptyBoard(), { row: 8, column: 3 });

    expect(moves.map((a) => `${a.row}${a.column}`).sort()).toEqual(
        [
            { row: 7, column: 1 },
            { row: 6, column: 2 },
            { row: 6, column: 4 },
            { row: 7, column: 5 },
        ]
            .map((a) => `${a.row}${a.column}`)
            .sort(),
    );
});

test("rook moves works", () => {
    const coordinates = { row: 4, column: 4 };
    const rook = createRook(Color.White, { row: coordinates.row, column: coordinates.column });
    const board = createBoardWithPieces([
        rook
    ])
    const moves = rook.piece.moves(board.board, coordinates)

    const expected = [
        { row: 1, column: 4 },
        { row: 2, column: 4 },
        { row: 3, column: 4 },
        { row: 5, column: 4 },
        { row: 6, column: 4 },
        { row: 7, column: 4 },
        { row: 8, column: 4 },
        { row: 4, column: 1 },
        { row: 4, column: 2 },
        { row: 4, column: 3 },
        { row: 4, column: 5 },
        { row: 4, column: 6 },
        { row: 4, column: 7 },
        { row: 4, column: 8 },
    ];

    expect(moves.map((a) => `${a.row}${a.column}`).sort()).toEqual(
        expected.map((a) => `${a.row}${a.column}`).sort(),
    );
});

test("queen moves works", () => {
    const coordinates = { row: 4, column: 4 };
    const queen = createQueen(Color.White, coordinates);
    const board = createBoardWithPieces([
        queen
    ])
    const moves = queen.piece.moves(board.board, coordinates)

    const expected = [
        { row: 1, column: 1 },
        { row: 2, column: 2 },
        { row: 3, column: 3 },
        { row: 5, column: 5 },
        { row: 6, column: 6 },
        { row: 7, column: 7 },
        { row: 8, column: 8 },

        { row: 5, column: 3 },
        { row: 6, column: 2 },
        { row: 7, column: 1 },
        { row: 3, column: 5 },
        { row: 2, column: 6 },
        { row: 1, column: 7 },

        { row: 1, column: 4 },
        { row: 2, column: 4 },
        { row: 3, column: 4 },
        { row: 5, column: 4 },
        { row: 6, column: 4 },
        { row: 7, column: 4 },
        { row: 8, column: 4 },
        { row: 4, column: 1 },
        { row: 4, column: 2 },
        { row: 4, column: 3 },
        { row: 4, column: 5 },
        { row: 4, column: 6 },
        { row: 4, column: 7 },
        { row: 4, column: 8 },
    ];

    expect(moves.map((a) => `${a.row}${a.column}`).sort()).toEqual(
        expected.map((a) => `${a.row}${a.column}`).sort(),
    );
});
