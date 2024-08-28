package board

import (
	"fmt"
)

type Coordinate string

type Piece string

type Cell struct {
	//TODO: this will change to a piece type
	piece      Piece
	coordinate Coordinate
}

type Game struct {
	board [][]Cell
}

func newCoordinate(row int, column int) (*Coordinate, error) {
	if row > 7 || row < 0 {
		return nil, fmt.Errorf("row cannot be greater than 7 or less than 0, but got %d", row)
	}

	if column > 7 || column < 0 {
		return nil, fmt.Errorf("column cannot be greater than 7 or less than 0, but got %d", column)
	}

	columnMap := map[int]string{
		0: "A",
		1: "B",
		2: "C",
		3: "D",
		4: "E",
		5: "F",
		6: "G",
		7: "H",
	}

	r := row + 1
	c := columnMap[column]

	coord := Coordinate(fmt.Sprintf("%s%d", c, r))

	return &coord, nil
}

func newCell(piece Piece, coordinate Coordinate) *Cell {
	c := Cell{piece, coordinate}
	return &c
}

// func newGame() *Game {
//
// 	var board [8][8]Cell
// 	// for i := 0; i < 8; i++ {
// 	// 	for j := 0; i < 8; j++ {
// 	//         board[i][j] = newCell("")
// 	// }
//
// }
