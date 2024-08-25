import { expect, test } from "vitest";
import {
    selectPiece,
} from "../model/GameState";
import { createBoardWithPieces } from "../model/Board";
import { defaultGame } from '../utils/gameStates';
import { PieceName } from "../model/pieces/PieceName";
import { createGameState } from "../model/GameState";
import { createBishop } from "../model/pieces/Bishop";
import { Color } from "../model/pieces/ActivePiece";

test("set selected piece unselects if current is selected", () => {
    const state = defaultGame();

    const bishop = state.getPiece({row:1, column:6});
    expect(bishop?.piece.name).toEqual(PieceName.Bishop);

    const newState = selectPiece(state, { row: 1, column: 2 });
    const noSelectedState = selectPiece(newState, { row: 1, column: 2 });

    expect(noSelectedState.selectedPiece).toEqual(undefined);
});

test("set selected happy path", () => {
    const bishop = createBishop(Color.White, { row: 1, column: 7 });
    const board = createBoardWithPieces([
        bishop

    ])
    const state = createGameState(board, undefined, Color.Black)

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
