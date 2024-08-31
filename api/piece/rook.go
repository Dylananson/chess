package piece

type Rook struct{}

func (r Rook) Name() string {
	return RookName
}

func NewRook() Piece {
	return Rook{}
}

const (
	RookName = "R"
)
