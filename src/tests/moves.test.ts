import { expect, test } from "vitest";
import { BishopMoves } from "../Board";

test("bishop moves works", () => {
  const moves = BishopMoves({ row: 1, column: 1 });

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
