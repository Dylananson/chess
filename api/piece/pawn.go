package piece

type Pawn struct{}

func (p Pawn) Name() string {
	return PawnName
}

func NewPawn() Piece {
	return Pawn{}
}

const (
	PawnName = "P"
)
