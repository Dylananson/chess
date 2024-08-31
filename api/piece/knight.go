package piece

type Knight struct{}
func (k Knight) Name() string {
	return KnightName
}

func NewKnight() Piece {
	return Knight{}
}

const (
	KnightName = "N"
)
