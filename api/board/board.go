package board

import (
	"fmt"
	"piece"
)

type Coordinate string

type File rune
type Rank rune

func (c Coordinate) File() File {
	return File(rune(c[0]))
}

func (c Coordinate) Rank() Rank {
	return Rank(rune(c[1]))
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

type Color string

type Cell struct {
	ActivePiece
	coordinate Coordinate
}

type Game struct {
	board [8][8]Cell
}

type ActivePiece struct {
	piece piece.Piece
	color Color
}

func newActivePiece(piece piece.Piece, color Color) *ActivePiece {
	return &ActivePiece{piece, color}
}

func getInitialPieceMap() map[Coordinate]ActivePiece {
	m := make(map[Coordinate]ActivePiece)
	m["A1"] = *newActivePiece(piece.NewRook(), "white")
	m["B1"] = *newActivePiece(piece.NewKnight(), "white")
	m["C1"] = *newActivePiece(piece.NewBishop(), "white")
	m["D1"] = *newActivePiece(piece.NewQueen(), "white")
	m["E1"] = *newActivePiece(piece.NewKing(), "white")
	m["F1"] = *newActivePiece(piece.NewBishop(), "white")
	m["G1"] = *newActivePiece(piece.NewKnight(), "white")
	m["H1"] = *newActivePiece(piece.NewRook(), "white")
	m["A2"] = *newActivePiece(piece.NewPawn(), "white")
	m["B2"] = *newActivePiece(piece.NewPawn(), "white")
	m["C2"] = *newActivePiece(piece.NewPawn(), "white")
	m["D2"] = *newActivePiece(piece.NewPawn(), "white")
	m["E2"] = *newActivePiece(piece.NewPawn(), "white")
	m["F2"] = *newActivePiece(piece.NewPawn(), "white")
	m["G2"] = *newActivePiece(piece.NewPawn(), "white")
	m["H2"] = *newActivePiece(piece.NewPawn(), "white")

	m["A8"] = *newActivePiece(piece.NewRook(), "black")
	m["B8"] = *newActivePiece(piece.NewKnight(), "black")
	m["C8"] = *newActivePiece(piece.NewBishop(), "black")
	m["D8"] = *newActivePiece(piece.NewQueen(), "black")
	m["E8"] = *newActivePiece(piece.NewKing(), "black")
	m["F8"] = *newActivePiece(piece.NewBishop(), "black")
	m["G8"] = *newActivePiece(piece.NewKnight(), "black")
	m["H8"] = *newActivePiece(piece.NewRook(), "black")
	m["A7"] = *newActivePiece(piece.NewPawn(), "black")
	m["B7"] = *newActivePiece(piece.NewPawn(), "black")
	m["C7"] = *newActivePiece(piece.NewPawn(), "black")
	m["D7"] = *newActivePiece(piece.NewPawn(), "black")
	m["E7"] = *newActivePiece(piece.NewPawn(), "black")
	m["F7"] = *newActivePiece(piece.NewPawn(), "black")
	m["G7"] = *newActivePiece(piece.NewPawn(), "black")
	m["H7"] = *newActivePiece(piece.NewPawn(), "black")
	return m
}

func (c Cell) String() string {
	if c.piece == nil {
		return "__"
	}
	var color Color
	if color == "black" {
		color = "B"
	} else {
		color = "W"
	}
	return fmt.Sprintf("%s%s", color, c.piece.Name())
}

func newCell(piece ActivePiece, coordinate Coordinate) *Cell {
	c := Cell{piece, coordinate}
	return &c
}

func newGame() (*Game, error) {
	var board [8][8]Cell
	initPieceMap := getInitialPieceMap()
	for i := 0; i < 8; i++ {
		for j := 0; j < 8; j++ {
			coord, err := newCoordinate(i, j)
			if err != nil {
				return nil, err
			}
			piece := initPieceMap[*coord]

			board[i][j] = *newCell(piece, *coord)
		}
	}

	return &Game{board}, nil
}

func (g Game) String() string {
	var str string
	str += "   A  B  C  D  E  F  G  H\n"
	str += "   _________________________\n"

	for i := 0; i < 8; i++ {
		str += fmt.Sprintf("%d  |", i+1)
		for j := 0; j < 8; j++ {
			str += fmt.Sprintf("%s|", g.board[i][j])
		}
		str += "\n"
	}

	str += "   _________________________\n"
	return str
}

// pgn
// 1. e4 e5
// 2. Nf3 Nc6
// move number, {piece {optional file letter|optional rank |exact square} {optional x} to {optional +, if check} {optional # if checkmate} } | 0-0-0 | 0-0
type Command struct {
	color Color

	piece string
	to    Coordinate

	file   string
	rank   string
	square Coordinate

	take      bool
	check     bool
	checkmate bool
	promotion string

	castleKingside  bool
	castleQueenside bool

	moveNumber int
}

func newCommand(
	color Color,

	piece string,
	to Coordinate,

	file string,
	rank string,
	square Coordinate,

	take bool,
	check bool,
	checkmate bool,
	promotion string,

	castleKingside bool,
	castleQueenside bool,

	moveNumber int,
) Command {
	return Command{
		color,
		piece,
		to,
		file,
		rank,
		square,
		take,
		check,
		checkmate,
		promotion,
		castleKingside,
		castleQueenside,
		moveNumber,
	}
}

func newCommandFromString(s string) Command {
	//ptr := 0


	return Command{}
}

func (c Command) String() (string, error) {
	var out string

	if c.color == "white" {
		out += fmt.Sprintf("%d. ", c.moveNumber)
	}

	if c.castleKingside {
		return out + fmt.Sprintf("%d. O-O", c.moveNumber), nil
	}

	if c.castleQueenside {
		return out + fmt.Sprintf("%d. O-O-O", c.moveNumber), nil
	}

	if c.piece != "P" {
		out += fmt.Sprintf("%s", c.piece)
	}

	if c.file != "" {
		out += fmt.Sprintf("%s", c.file)
	}

	if c.rank != "" {
		out += fmt.Sprintf("%s", c.rank)
	}

	if c.square != "" {
		out += fmt.Sprintf("%s", c.square)
	}

	if c.take {
		if c.piece == "P" {
			if c.file == "" {
				return "", fmt.Errorf("must specify file if pawn is taking a piece")
			}
		}
		out += "x"
	}

	out += fmt.Sprintf("%s", c.to)

	if c.promotion != "" {
		out += fmt.Sprintf("=%s", c.promotion)
	}

	if c.check {
		out += "+"
	}

	if c.checkmate {
		out += "#"
	}

	return out, nil
}

func (g Game) MovePiece(command Command) error {

	return nil
}
