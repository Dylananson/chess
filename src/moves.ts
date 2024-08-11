type Coordinate = { row: number; column: number };

const filterOffBoard = (coordinate: Coordinate) => {
  return (
    coordinate.row <= 8 &&
    coordinate.row >= 1 &&
    coordinate.column >= 1 &&
    coordinate.column <= 8
  );
};

export function bishopMoves(coordinates: Coordinate) {
  const dirs = [
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];
  let res: Array<Coordinate> = [];
  dirs.forEach(([r, c]) => {
    let currentCoordinate = coordinates;

    while (filterOffBoard(currentCoordinate)) {
      res.push(currentCoordinate);
      currentCoordinate.row += r;
      currentCoordinate.column += c;
    }
  });
  return res;
}
