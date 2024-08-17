import { useState } from "react"
import blackKingSvg from './assets/Chess_kdt45.svg'
import whiteKingSvg from './assets/Chess_klt45.svg'
import blackBishopSvg from './assets/Chess_bdt45.svg'
import whiteBishopSvg from './assets/Chess_blt45.svg'
import blackKnightSvg from './assets/Chess_ndt45.svg'
import whiteKnightSvg from './assets/Chess_nlt45.svg'
import blackQueenSvg from './assets/Chess_qdt45.svg'
import whiteQueenSvg from './assets/Chess_qlt45.svg'
import blackRookSvg from './assets/Chess_rdt45.svg'
import whiteRookSvg from './assets/Chess_rlt45.svg'
import blackPawnSvg from './assets/Chess_pdt45.svg'
import whitePawnSvg from './assets/Chess_plt45.svg'


export enum PieceName {
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

export type ActivePiece = {
    color: Color
    piece: Piece
    startingCoordinate: Coordinate
    id: string
}

type MovesFunction = (coorinates: Coordinate) => Array<Coordinate>

export type Piece = {
    name: PieceName
    value: number
    moves: MovesFunction
    draw: DrawPieceFunction
}

export enum Color {
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
    return color === Color.Black ? <img src={blackKingSvg} /> : <img src={whiteKingSvg} />
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
    }).filter(isOnBoard)
}

const isOnBoard = (coordinate: Coordinate) => {
    return (coordinate.row <= 8 && coordinate.row >= 1 && coordinate.column >= 1 && coordinate.column <= 8)
}


export function BishopMoves(coordinates: Coordinate) {
    const dirs = [[-1, -1], [1, 1], [-1, 1], [1, -1]]
    let res: Array<Coordinate> = []
    dirs.forEach(([r, c]) => {
        let currentCoordinate = { row: coordinates.row, column: coordinates.column }
        currentCoordinate.row += r
        currentCoordinate.column += c

        while (isOnBoard(currentCoordinate)) {
            res.push({ row: currentCoordinate.row, column: currentCoordinate.column })
            currentCoordinate.row += r
            currentCoordinate.column += c
        }

    })
    return res
}



function FakeMoves(coordinates: Coordinate) {
    return []
}

export function KnightMoves(coordinates: Coordinate): Array<Coordinate> {
    const dirs = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2]
    ]

    const out: Array<Coordinate> = [];

    dirs.forEach(d => {
        const coord = { row: coordinates.row + d[0], column: coordinates.column + d[1] }

        if (isOnBoard(coord)) {
            out.push(coord)
        }
    })

    return out
}

const King: Piece = {
    name: PieceName.King,
    draw: KingDisplay,
    value: - 1,
    moves: KingMoves
}

function KnightDisplay(color: Color) {
    return color === Color.Black ? <img src={blackKnightSvg} /> : <img src={whiteKnightSvg} />
}

const Knight: Piece = {
    name: PieceName.King,
    draw: KnightDisplay,
    value: - 1,
    moves: KnightMoves
}



function PawnDisplay(color: Color) {
    return color === Color.Black ? <img src={blackPawnSvg} /> : <img src={whiteKingSvg} />
}

const Pawn: Piece = {
    name: PieceName.Pawn,
    draw: PawnDisplay,
    value: -1,
    moves: FakeMoves
}

function BishopDisplay(color: Color) {
    return color === Color.Black ? <img src={blackBishopSvg} /> : <img src={whiteBishopSvg} />
}


const Bishop: Piece = {
    name: PieceName.Bishop,
    draw: BishopDisplay,
    value: -1,
    moves: BishopMoves
}

function RookDisplay(color: Color) {
    return color === Color.Black ? <img src={blackRookSvg} /> : <img src={whiteRookSvg} />
}

export function RookMoves(coordinates: Coordinate): Array<Coordinate> {
    const out: Array<Coordinate> = []

    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ]

    dirs.forEach(d => {
        let newCoord = { row: coordinates.row + d[0], column: coordinates.column + d[1] }

        while (isOnBoard(newCoord)) {
            if (!compareCoordinates(newCoord, coordinates)) {
                out.push(newCoord)
            }
            newCoord = { row: newCoord.row + d[0], column: newCoord.column + d[1] }
        }
    })

    return out
}

export const Rook: Piece = {
    name: PieceName.Rook,
    draw: RookDisplay,
    value: -1,
    moves: RookMoves
}


export function QueenMoves(coordinates: Coordinate): Array<Coordinate> {
    return RookMoves(coordinates).concat(BishopMoves(coordinates))
}

function QueenDisplay(color: Color): React.ReactNode {
    return color === Color.Black ? <img src={blackQueenSvg} /> : <img src={whiteQueenSvg} />
}

const Queen: Piece = {
    name: PieceName.Queen,
    draw: QueenDisplay,
    value: -1,
    moves: QueenMoves
}

const BlackKing: ActivePiece = {
    id: "BlkK",
    color: Color.Black,
    piece: King,
    startingCoordinate: { row: 8, column: ColumnValues.E },
}

const WhiteKing: ActivePiece = {
    id: "WhtK",
    color: Color.White,
    piece: King,
    startingCoordinate: { row: 1, column: ColumnValues.E },
}

const WhiteQueen: ActivePiece = {
    id: "WhtQ",
    color: Color.White,
    piece: Queen,
    startingCoordinate: { row: 1, column: ColumnValues.D },
}

const BlackQueen: ActivePiece = {
    id: "BlkQ",
    color: Color.Black,
    piece: Queen,
    startingCoordinate: { row: 8, column: ColumnValues.D },
}

const WhiteARook: ActivePiece = {
    id: "WhtARook",
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: ColumnValues.A },
}

const WhiteHRook: ActivePiece = {
    id: "WhtHRook",
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: ColumnValues.H },
}

const BlackARook: ActivePiece = {
    id: "BlkARook",
    color: Color.Black,
    piece: Rook,
    startingCoordinate: { row: 8, column: ColumnValues.A },
}


const BlackHRook: ActivePiece = {
    id: "BlkHRook",
    color: Color.Black,
    piece: Rook,
    startingCoordinate: { row: 8, column: ColumnValues.H },
}

const WhiteBBishop: ActivePiece = {
    id: "WhtBBishop",
    color: Color.White,
    piece: Bishop,
    startingCoordinate: { row: 1, column: ColumnValues.B },
}


const WhiteGBishop: ActivePiece = {
    id: "WhtGBishop",
    color: Color.White,
    piece: Bishop,
    startingCoordinate: { row: 1, column: ColumnValues.G },
}


const BlackBBishop: ActivePiece = {
    id: "BlkBBishop",
    color: Color.Black,
    piece: Bishop,
    startingCoordinate: { row: 8, column: ColumnValues.B },
}


const BlackGBishop: ActivePiece = {
    id: "BlkGBishop",
    color: Color.Black,
    piece: Bishop,
    startingCoordinate: { row: 8, column: ColumnValues.G },
}

const WhiteCKnight: ActivePiece = {
    id: "WhtCKnight",
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: ColumnValues.C },
}


const WhiteFKnight: ActivePiece = {
    id: "WhtFKnight",
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: ColumnValues.F },
}

const BlackCKnight: ActivePiece = {
    id: "BlkCKnight",
    color: Color.Black,
    piece: Knight,
    startingCoordinate: { row: 8, column: ColumnValues.C },
}


const BlackFKnight: ActivePiece = {
    id: "BlkFKnight",
    color: Color.Black,
    piece: Knight,
    startingCoordinate: { row: 8, column: ColumnValues.F },
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

function MoveMarker() {
    return (
        <>
            <svg className="fill-gray-400 absolute w-16 opacity-80" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z">
                    </path>
                </g></svg>
        </>
    )
}

export const emptyRow = (): Row<undefined> => {
    return Array.from(Array(8))
}
export const emptyBoard = (): Board<undefined> => {
    return Array.from(Array(8)).map(emptyRow);
}

type Row<T> = Array<T>

export type Board<T> = Array<Array<undefined | T>>

const initBoard = () => {
    const board: Board<ActivePiece>= emptyBoard()
    AllPieces.forEach((piece) => {
        board[piece.startingCoordinate.row - 1][piece.startingCoordinate.column - 1] = piece
    })
    return board
}

type SelectedPiece = {
    piece: ActivePiece,
    coordinates: Coordinate,
    moves: Board<boolean>
}

type GameState = {
    board: Board<ActivePiece>
    selectedPiece: SelectedPiece | undefined
    playerTurn: Color
    //TODO: i dont like this how to fix
}

export function compareCoordinates(coord1: Coordinate, coord2: Coordinate) {
    return coord1.row === coord2.row && coord1.column === coord2.column
}


export function movePiece(gameState: GameState, newCoordinates: Coordinate): GameState {
    if (!gameState.selectedPiece) {
        console.log("Cannot move piece if no piece is selected");
        return gameState
    }

    console.log(`Attempting to move piece ${gameState.selectedPiece.piece.piece.name} moved from ${gameState.selectedPiece.coordinates.row} ${gameState.selectedPiece.coordinates.column} to ${newCoordinates.row} ${newCoordinates.column}`)

    if (!gameState.selectedPiece.moves[newCoordinates.row - 1][newCoordinates.column - 1]) {
        console.log("Cannot move piece to invalid spot")
        return gameState
    }

    const pieceAtCoordinates = gameState.board[newCoordinates.row - 1][newCoordinates.column - 1]

    if (pieceAtCoordinates && pieceAtCoordinates.color === gameState.selectedPiece.piece.color) {
        console.log("Cannot move piece on top of piece of the same team")
        return gameState
    }


    const gameWithoutSelectedPiece = { ...gameState, selectedPiece: undefined, selectedPieceMoves: emptyBoard() }

    const newBoard = [...gameState.board]
    newBoard[gameState.selectedPiece.coordinates?.row - 1][gameState.selectedPiece?.coordinates.column - 1] = undefined
    newBoard[newCoordinates.row - 1][newCoordinates.column - 1] = gameState.selectedPiece.piece

    console.log(`Piece ${gameState.selectedPiece.piece.piece.name} moved from ${gameState.selectedPiece.coordinates.row} ${gameState.selectedPiece.coordinates.column} to ${newCoordinates.row} ${newCoordinates.column}`)
    return { ...gameWithoutSelectedPiece, board: newBoard }
}

export function setSelectedPieceForState(gameState: GameState, coordinate: Coordinate): GameState {
    const selectedPiece = gameState.board[coordinate.row - 1][coordinate.column - 1]

    if (!selectedPiece) {
        return { ...gameState, selectedPiece: undefined }
    }
    console.log("Selecting piece")

    const pieceMoves = selectedPiece.piece.moves(coordinate)

    if (gameState?.selectedPiece?.piece.id === gameState.board[coordinate.row - 1][coordinate.column - 1]?.id) {
        console.log("Piece already selected")
        return { ...gameState, selectedPiece: undefined }
    }
    //TODO: can i do some type magic to avoid typing it every time
    const board: Board<boolean>= emptyBoard()

    pieceMoves.forEach((move) => {
        board[move.row - 1][move.column - 1] = true
    })

    return { ...gameState, selectedPiece: { coordinates: coordinate, piece: selectedPiece, moves: board } }
}


export const initGameState = (): GameState => ({
    board: initBoard(),
    playerTurn: Color.White,
    selectedPiece: undefined,
})

const isDarkSquare = (row:number, column: number) => {
    if (row % 2 === 0) {
        return column % 2 === 0
    } else {
        return column % 2 === 1
    }
}
function Game() {
    const [gameState, setGameState] = useState<GameState>(initGameState())
    const rows = [1, 2, 3, 4, 5, 6, 7, 8]
    const columns = [1, 2, 3, 4, 5, 6, 7, 8]

    console.log(gameState.selectedPiece)
    if (gameState.selectedPiece) {
        console.log(gameState.selectedPiece?.piece.piece.moves(gameState.selectedPiece.coordinates))
    }

    const handleClick = (newCoordinates: Coordinate) => {
        const selectedPiece = gameState.selectedPiece

        if (!selectedPiece) {
            setGameState(setSelectedPieceForState(gameState, newCoordinates))
        } else {
            setGameState(movePiece(gameState, newCoordinates))
        }
    }

    return (
        <>
            <div className="b-4 contents-center center justify-center justify-items-center place-items-center">
                {rows.reverse().map((row) => (
                    <div key={row} className="flex justify-items-center place-items-center">
                        {columns.map((column) => {
                            const p = gameState.board[row - 1][column - 1]
                            const validMove = gameState.selectedPiece?.moves[row - 1][column - 1] ?? false

                            const bgColor = isDarkSquare(row, column)? "bg-green-800" : "bg-gray-200"
                            return (

                                <div key={`${row}${column}`} onClick={() => handleClick({ row: row, column: column })} id={`${row} ${column}`} className={`${bgColor}  w-16 h-16 flex items-center justify-center`} >
                                    {p?.piece.draw(p.color)}
                                    {validMove ? <MoveMarker /> : <></>}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div >
        </>
    )
}

export default Game
