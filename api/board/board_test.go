package board

import (
	"fmt"
	"testing"
)

func TestCoordinateCreation(t *testing.T) {
	var tests = []struct {
		a, b int
		want Coordinate
		err  bool
	}{
		{0, 0, "A1", false},
		{7, 7, "H8", false},
		{4, 4, "E5", false},
		{8, 0, "", true},
		{0, 8, "", true},
		{-1, 0, "", true},
		{0, -1, "", true},
	}

	for _, tt := range tests {
		testname := fmt.Sprintf("%d%d", tt.a, tt.b)
		t.Run(testname, func(t *testing.T) {
			ans, err := newCoordinate(tt.a, tt.b)
			if tt.err && err == nil {
				t.Errorf("expected error, with values %d, %d", tt.a, tt.b)
				return
			}

			if err != nil {
				if !tt.err {
					t.Errorf("unexpected error with values %d, %d", tt.a, tt.b)
				}
				return
			}

			if *ans != tt.want {
				t.Errorf("got %s, want %s", *ans, tt.want)
			}

		})

	}
}

func TestNewGame(t *testing.T) {
	g, err := newGame()
	if err != nil {
		t.Errorf("unexpected error %v", err)
	}

	if g == nil {
		t.Errorf("expected game to be created")
	}

	fmt.Printf("%v", g)
}

func TestCommandString(t *testing.T) {
	var tests = []struct {
		input Command
		want  string
		err   bool
	}{
		{
			Command{
				color:      "white",
				piece:      "N",
				to:         "F3",
				moveNumber: 1,
			},
			"1. NF3",
			false,
		},
		{
			Command{
				color:           "white",
				piece:           "N",
				to:              "F3",
				moveNumber:      2,
			},
			"2. NF3",
			false,
		},
		{
			Command{
				color:      "white",
				piece:      "P",
				to:         "e8",
				moveNumber: 1,
			},
			"1. e8",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "P",
				to:         "e8",
				moveNumber: 1,
			},
			"e8",
			false,
		},
		{
			Command{
				color:      "white",
				piece:      "P",
				to:         "e8",
				promotion:  "Q",
				moveNumber: 8,
			},
			"8. e8=Q",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "P",
				to:         "e1",
				promotion:  "Q",
				moveNumber: 8,
			},
			"e1=Q",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "P",
				to:         "e1",
				check:      true,
				promotion:  "Q",
				moveNumber: 8,
			},
			"e1=Q+",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "P",
				to:         "e1",
				checkmate:  true,
				promotion:  "Q",
				moveNumber: 8,
			},
			"e1=Q#",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "P",
				to:         "f5",
				file:       "e",
				take:       true,
				moveNumber: 8,
			},
			"exf5",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "P",
				to:         "f5",
				file:       "e",
				checkmate:  true,
				take:       true,
				moveNumber: 8,
			},
			"exf5#",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "R",
				to:         "e5",
				file:       "a",
				moveNumber: 8,
			},
			"Rae5",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "R",
				to:         "e5",
				rank:       "1",
				moveNumber: 8,
			},
			"R1e5",
			false,
		},
		{
			Command{
				color:      "black",
				piece:      "R",
				to:         "e5",
				rank:       "1",
				moveNumber: 8,
			},
			"R1e5",
			false,
		},
	}

	for _, tt := range tests {
		testname := fmt.Sprintf("%v", tt.input)
		t.Run(testname, func(t *testing.T) {
			ans, err := tt.input.String()
			if err != nil {
				if !tt.err {
					t.Errorf("unexpected error %v", err)
				}

			}
			if ans != tt.want {
				t.Errorf("got %s, want %s", ans, tt.want)
			}
		})
	}

}
