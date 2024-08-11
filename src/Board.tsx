import { useState } from "react"
enum PieceName {
    Pawn,
    King,
    Queen,
    Rook,
    Bishop,
    Knight
}

enum ColumnValues {
    A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8
}
type Coordinate = { row: number, column: number }

type PieceCoordinates = {
    color: Color
    piece: Piece
    startingCoordinate: Coordinate
    curentCoordinate: Coordinate
}

type MovesFunction = (coorinates: Coordinate) => Array<Coordinate>

type Piece = {
    name: PieceName
    value: number
    moves: MovesFunction
    draw: DrawPieceFunction
}

enum Color {
    White,
    Black
}

type DrawPieceFunction = (color: Color) => React.ReactNode

function PieceColorDisplay(color: Color, value: string): React.ReactNode {
    const colorStyle = color === Color.White ? 'text-white' : 'text-black'
    return (<div className={`${colorStyle}`}>
        {value}
    </div>)
}

function KingDisplay(color: Color) {
    return PieceColorDisplay(color, "K")
}

const columnNumericMap = {
    "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8
}

const numericColumnMap = {
    1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H"
}

function getNumbericOfColumn(col: number) {
    let out = ColumnValues.A
    switch (col) {
        case 1:
            out = ColumnValues.A
            break;
        case 2:
            out = ColumnValues.B
            break;
        case 3:
            out = ColumnValues.C
            break;
        case 4:
            out = ColumnValues.D
            break;
        case 5:
            out = ColumnValues.E
            break;
        case 6:
            out = ColumnValues.F
            break;
        case 7:
            out = ColumnValues.G
            break;
        case 8:
            out = ColumnValues.H
            break;
    }
    return out
}

function KingMoves(coordinates: Coordinate) {
    const dirs = [
        [1, 0],   // move right
        [-1, 0],  // move left
        [0, 1],   // move up
        [0, -1],  // move down
        [1, 1],   // move diagonally up-right
        [1, -1],  // move diagonally down-right
        [-1, 1],  // move diagonally up-left
        [-1, -1]  // move diagonally down-left
    ];
    return dirs.map(([r, c]) => {
        const colValue = coordinates.column + c
        return { row: coordinates.row + r, column: colValue }
    }).filter(filterOffBoard)
}

const filterOffBoard = (coordinate: Coordinate) => {
    return (coordinate.row <= 8 && coordinate.row >= 1 && coordinate.column >= 1 && coordinate.column <= 8)
}


function FakeMoves(coordinates: Coordinate) {
    return []
}

const King: Piece = {
    name: PieceName.King,
    draw: KingDisplay,
    value: - 1,
    moves: KingMoves
}

function KnightDisplay(color: Color) {
    return PieceColorDisplay(color, "k")
}

const Knight: Piece = {
    name: PieceName.King,
    draw: KnightDisplay,
    value: - 1,
    moves: FakeMoves
}



function PawnDisplay(color: Color) {
    return PieceColorDisplay(color, "P")
}

const Pawn: Piece = {
    name: PieceName.King,
    draw: PawnDisplay,
    value: -1,
    moves: FakeMoves
}

function BishopDisplay(color: Color) {
    return PieceColorDisplay(color, "B")
}


const Bishop: Piece = {
    name: PieceName.King,
    draw: BishopDisplay,
    value: -1,
    moves: FakeMoves
}

function RookDisplay(color: Color) {
    return PieceColorDisplay(color, "R")
}

const Rook: Piece = {
    name: PieceName.King,
    draw: RookDisplay,
    value: -1,
    moves: FakeMoves
}


function QueenDisplay(color: Color): React.ReactNode {
    return PieceColorDisplay(color, "Q")
}

const Queen: Piece = {
    name: PieceName.King,
    draw: QueenDisplay,
    value: -1,
    moves: FakeMoves
}

const BlackKing: PieceCoordinates = {
    color: Color.Black,
    piece: King,
    startingCoordinate: { row: 8, column: ColumnValues.E },
    curentCoordinate: { row: 8, column: ColumnValues.E }
}

const WhiteKing: PieceCoordinates = {
    color: Color.White,
    piece: King,
    startingCoordinate: { row: 1, column: ColumnValues.E },
    curentCoordinate: { row: 1, column: ColumnValues.E }
}

const WhiteQueen: PieceCoordinates = {
    color: Color.White,
    piece: Queen,
    startingCoordinate: { row: 1, column: ColumnValues.D },
    curentCoordinate: { row: 1, column: ColumnValues.D }
}

const BlackQueen: PieceCoordinates = {
    color: Color.Black,
    piece: Queen,
    startingCoordinate: { row: 8, column: ColumnValues.D },
    curentCoordinate: { row: 8, column: ColumnValues.D }
}

const WhiteARook: PieceCoordinates = {
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: ColumnValues.A },
    curentCoordinate: { row: 1, column: ColumnValues.A }
}

const WhiteHRook: PieceCoordinates = {
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: ColumnValues.H },
    curentCoordinate: { row: 1, column: ColumnValues.H }
}

const BlackARook: PieceCoordinates = {
    color: Color.Black,
    piece: Rook,
    startingCoordinate: { row: 8, column: ColumnValues.A },
    curentCoordinate: { row: 8, column: ColumnValues.A },
}


const BlackHRook: PieceCoordinates = {
    color: Color.Black,
    piece: Rook,
    startingCoordinate: { row: 8, column: ColumnValues.H },
    curentCoordinate: { row: 8, column: ColumnValues.H },
}

const WhiteBBishop: PieceCoordinates = {
    color: Color.White,
    piece: Bishop,
    startingCoordinate: { row: 1, column: ColumnValues.B },
    curentCoordinate: { row: 1, column: ColumnValues.B },
}


const WhiteGBishop: PieceCoordinates = {
    color: Color.White,
    piece: Bishop,
    startingCoordinate: { row: 1, column: ColumnValues.G },
    curentCoordinate: { row: 1, column: ColumnValues.G },
}


const BlackBBishop: PieceCoordinates = {
    color: Color.Black,
    piece: Bishop,
    startingCoordinate: { row: 8, column: ColumnValues.B },
    curentCoordinate: { row: 8, column: ColumnValues.B },
}


const BlackGBishop: PieceCoordinates = {
    color: Color.Black,
    piece: Bishop,
    startingCoordinate: { row: 8, column: ColumnValues.G },
    curentCoordinate: { row: 8, column: ColumnValues.G },
}

const WhiteCKnight: PieceCoordinates = {
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: ColumnValues.C },
    curentCoordinate: { row: 1, column: ColumnValues.C },
}


const WhiteFKnight: PieceCoordinates = {
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: ColumnValues.F },
    curentCoordinate: { row: 1, column: ColumnValues.F },
}

const BlackCKnight: PieceCoordinates = {
    color: Color.Black,
    piece: Knight,
    startingCoordinate: { row: 8, column: ColumnValues.C },
    curentCoordinate: { row: 8, column: ColumnValues.C },
}


const BlackFKnight: PieceCoordinates = {
    color: Color.Black,
    piece: Knight,
    startingCoordinate: { row: 8, column: ColumnValues.F },
    curentCoordinate: { row: 8, column: ColumnValues.F },
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

function ValidMove() {
    return <div className="absolute text-4xl text-blue-500 color-blue-500 justify-center align-center text-center">
        .
    </div>

}

function Board() {
    const [selectedPiece, setSelectedPiece] = useState<PieceCoordinates>()
    const rows = [1, 2, 3, 4, 5, 6, 7, 8]
    const columns = [1, 2, 3, 4, 5, 6, 7, 8]

    if (selectedPiece) {
        console.log(selectedPiece.piece.moves(selectedPiece?.curentCoordinate))
    }

    const handleSelectPiece = (p: PieceCoordinates | undefined) => {
        if (!p) {
            return
        }

        if (p == selectedPiece) {
            setSelectedPiece(undefined)
            return
        }

        setSelectedPiece(p)
    }

    return (
        <>
            <div className="b-4 contents-center center justify-center justify-items-center place-items-center">
                {rows.reverse().map((row) => (
                    <div className="flex justify-items-center place-items-center">
                        {columns.map((column) => {
                            const p = AllPieces.find((piece) => piece.curentCoordinate.row === row && piece.curentCoordinate.column.valueOf() === column)
                            let validMove = false
                            if (selectedPiece) {
                                const found = selectedPiece.piece.moves(selectedPiece.curentCoordinate).find(coordinate => coordinate.row === row && coordinate.column === column)
                                validMove = found ? true : false
                            }
                            return (
                                <div key={`${row}${column}`} onClick={() => handleSelectPiece(p)} id={`${row} ${column}`} className="bg-red-500 border-black border-2 w-16 h-16 flex items-center justify-center" >
                                    {p?.piece.draw(p.color)}
                                    {validMove ? <ValidMove /> : <></>}
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
