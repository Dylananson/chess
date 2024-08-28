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
