package piece


type Queen struct{}
func (q Queen) Name() string {
	return QueenName
}

func NewQueen() Piece {
	return Queen{}
}

const (
	QueenName = "Q"
)
