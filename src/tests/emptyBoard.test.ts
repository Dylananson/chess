import { expect, test } from "vitest";
import { emptyBoard } from "../Board";

test("board creation works", () => {
  const board = emptyBoard();

  expect(board.length).toEqual(8);

  board.forEach((r) => {
    expect(r.length).toEqual(8);
  });
});
