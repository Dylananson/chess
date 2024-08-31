package piece

type Bishop struct{}

func (b Bishop) Name() string {
	return BishopName
}

func NewBishop() Piece {
	return Bishop{}
}

const (
	BishopName = "B"
)
