enum PieceName {
    Pawn,
    King,
    Queen,
    Rook,
    Bishop,
    Knight
}
type Coordinate = { row: number, column: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" }

type PieceCoordinates = {
    color: Color
    piece: Piece
    startingCoordinate: Coordinate
    curentCoordinate: Coordinate
}

type Piece = {
    name: PieceName
    value: number
    moves: Function
    draw: DrawPieceFunction
}

enum Color {
    White,
    Black
}

type DrawPieceFunction = (color: Color) => React.ReactNode

function PieceColorDisplay(color: Color, value: string): React.ReactNode {
    return (<div className={color === Color.White ? 'text-white' : 'text-black'}>
        {value}
    </div>)
}

function KingDisplay(color: Color) {
    return PieceColorDisplay(color, "K")
}

const King: Piece = {
    name: PieceName.King,
    draw: KingDisplay,
    value: - 1,
    moves: () => 1 + 1
}

function KnightDisplay(color: Color) {
    return PieceColorDisplay(color, "k")
}

const Knight: Piece = {
    name: PieceName.King,
    draw: KnightDisplay,
    value: - 1,
    moves: () => 1 + 1
}



function PawnDisplay(color: Color) {
    return PieceColorDisplay(color, "P")
}

const Pawn: Piece = {
    name: PieceName.King,
    draw: PawnDisplay,
    value: -1,
    moves: () => 1 + 1
}

function BishopDisplay(color: Color) {
    return PieceColorDisplay(color, "B")
}


const Bishop: Piece = {
    name: PieceName.King,
    draw: BishopDisplay,
    value: -1,
    moves: () => 1 + 1
}

function RookDisplay(color: Color) {
    return PieceColorDisplay(color, "R")
}

const Rook: Piece = {
    name: PieceName.King,
    draw: RookDisplay,
    value: -1,
    moves: () => 1 + 1
}


function QueenDisplay(color: Color): React.ReactNode {
    return PieceColorDisplay(color, "Q")
}

const Queen: Piece = {
    name: PieceName.King,
    draw: QueenDisplay,
    value: -1,
    moves: () => 1 + 1
}

const BlackKing: PieceCoordinates = {
    color: Color.Black,
    piece: King,
    startingCoordinate: { row: 8, column: "E" },
    curentCoordinate: { row: 8, column: "E" }
}

const WhiteKing: PieceCoordinates = {
    color: Color.White,
    piece: King,
    startingCoordinate: { row: 1, column: "E" },
    curentCoordinate: { row: 1, column: "E" }
}

const WhiteQueen: PieceCoordinates = {
    color: Color.White,
    piece: Queen,
    startingCoordinate: { row: 1, column: "D" },
    curentCoordinate: { row: 1, column: "D" }
}

const BlackQueen: PieceCoordinates = {
    color: Color.Black,
    piece: Queen,
    startingCoordinate: { row: 8, column: "D" },
    curentCoordinate: { row: 8, column: "D" }
}

const WhiteARook: PieceCoordinates = {
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: "A" },
    curentCoordinate: { row: 1, column: "A" }
}

const WhiteHRook: PieceCoordinates = {
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: "H" },
    curentCoordinate: { row: 1, column: "H" }
}

const BlackARook: PieceCoordinates = {
    color: Color.Black,
    piece: Rook,
    startingCoordinate: { row: 8, column: "A" },
    curentCoordinate: { row: 8, column: "A" },
}


const BlackHRook: PieceCoordinates = {
    color: Color.Black,
    piece: Rook,
    startingCoordinate: { row: 8, column: "H" },
    curentCoordinate: { row: 8, column: "H" },
}

const WhiteBBishop: PieceCoordinates = {
    color: Color.White,
    piece: Bishop,
    startingCoordinate: { row: 1, column: "B" },
    curentCoordinate: { row: 1, column: "B" },
}


const WhiteGBishop: PieceCoordinates = {
    color: Color.White,
    piece: Bishop,
    startingCoordinate: { row: 1, column: "G" },
    curentCoordinate: { row: 1, column: "G" },
}


const BlackBBishop: PieceCoordinates = {
    color: Color.Black,
    piece: Bishop,
    startingCoordinate: { row: 8, column: "B" },
    curentCoordinate: { row: 8, column: "B" },
}


const BlackGBishop: PieceCoordinates = {
    color: Color.Black,
    piece: Bishop,
    startingCoordinate: { row: 8, column: "G" },
    curentCoordinate: { row: 8, column: "G" },
}

const WhiteCKnight: PieceCoordinates = {
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: "C" },
    curentCoordinate: { row: 1, column: "C" },
}


const WhiteFKnight: PieceCoordinates = {
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: "F" },
    curentCoordinate: { row: 1, column: "F" },
}

const BlackCKnight: PieceCoordinates = {
    color: Color.Black,
    piece: Knight,
    startingCoordinate: { row: 8, column: "C" },
    curentCoordinate: { row: 8, column: "C" },
}


const BlackFKnight: PieceCoordinates = {
    color: Color.Black,
    piece: Knight,
    startingCoordinate: { row: 8, column: "F" },
    curentCoordinate: { row: 8, column: "F" },
}


const WhitePieces = [
    WhiteKing,
    WhiteQueen,
    WhiteBBishop,
    WhiteGBishop,
    WhiteHRook,
    WhiteARook,
    WhiteCKnight,
    WhiteFKnight
]

const BlackPieces = [
    BlackKing,
    BlackQueen,
    BlackBBishop,
    BlackGBishop,
    BlackHRook,
    BlackARook,
    BlackCKnight,
    BlackFKnight
]

const AllPieces = BlackPieces.concat(WhitePieces)


function Board() {
    const rows = [1, 2, 3, 4, 5, 6, 7, 8]
    const columns = ["A", "B", "C", "D", "E", "F", "G", "H"]

    return (
        <>
            <div className="b-4 contents-center center justify-center justify-items-center place-items-center">
                {rows.reverse().map((row) => (
                    <div className="flex">
                        {columns.map((column) => {
                            const p = AllPieces.find((piece) => piece.curentCoordinate.row === row && piece.curentCoordinate.column === column)



                            return (
                                < div id={`${row}${column}`} className="bg-red-500 border-black border-2 w-16 h-16" >
                                    {p?.piece.draw(p.color)}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div >
        </>
    )
}

export default Board
