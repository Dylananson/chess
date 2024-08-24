import { expect, test } from "vitest";
import {
    createBoard,
    selectPiece,
} from "../Game";
import { defaultGame } from '../utils/gameStates';
import { PieceName } from "../pieces/PieceName";
import { createGameState } from "./movePiece.test";
import { createBishop } from "../pieces/Bishop";
import { Color } from "../pieces/ActivePiece";

test("set selected piece unselects if current is selected", () => {
    const state = defaultGame();

    const bishop = state.board[0][5];

    expect(bishop?.piece.name).toEqual(PieceName.Bishop);

    const newState = selectPiece(state, { row: 1, column: 2 });
    const noSelectedState = selectPiece(newState, { row: 1, column: 2 });

    expect(noSelectedState.selectedPiece).toEqual(undefined);
});

test("set selected happy path", () => {
    const bishop = createBishop(Color.White, { row: 1, column: 7 });
    const board = createBoard([
        bishop

    ])
    const state = createGameState(board, undefined, Color.Black, false)

    const newState = selectPiece(state, { row: 1, column: 7 });

    const expectedResult = [
        [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        ],
        [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            undefined,
            true,
        ],
        [
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            undefined,
            undefined,
            undefined,
        ],
        [
            undefined,
            undefined,
            undefined,
            true,
            undefined,
            undefined,
            undefined,
            undefined,
        ],
        [
            undefined,
            undefined,
            true,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        ],
        [
            undefined,
            true,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        ],
        [
            true,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        ],
        [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        ],
    ];

    expect(newState.selectedPiece?.moves).toEqual(expectedResult);
});
