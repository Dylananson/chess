import { test, expect } from 'vitest';
import {defaultGame} from '../utils/gameStates';

test('moving piece updates history', () => {
    let game = defaultGame();

    console.log(game.history.length);

    game = game.move({ row: 2, column: 2 }, { row: 3, column: 2 });

    expect(game.history.length).toEqual(2);
})


test('not moving piece doesnt update history', () => {
    let game = defaultGame();

    game = game.move({ row: 2, column: 2 }, { row: 5, column: 2 });

    expect(game.history.length).toEqual(1);
})

