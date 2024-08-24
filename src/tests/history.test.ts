import { test, expect } from 'vitest';
import { selectPiece as selectPiece, tryMovePiece } from '../Game';
import {defaultGame} from '../utils/gameStates';

test('moving piece updates history', () => {
    let game = defaultGame();

    game = selectPiece(game, { row: 2, column: 2 });
    game = tryMovePiece(game, { row: 3, column: 2 });

    expect(game.history.length).toEqual(2);
})


test('not moving piece doesnt update history', () => {
    let game = defaultGame();

    game = selectPiece(game, { row: 2, column: 2 });
    game = tryMovePiece(game, { row: 5, column: 2 });

    expect(game.history.length).toEqual(1);
})

