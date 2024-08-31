package piece 

type King struct{}
func (k King) Name() string {
	return KingName
}
func NewKing() Piece {
	return King{}
}


const (
	KingName = "K"
)
