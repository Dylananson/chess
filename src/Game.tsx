import { useState } from "react"

import { PieceName } from "./pieces/PieceName"
import { King } from "./pieces/King"
import { Knight } from "./pieces/Knight"
import { Bishop } from "./pieces/Bishop"
import { Rook } from "./pieces/Rook"
import { Queen } from "./pieces/Queen"
import { Pawn } from "./pieces/Pawn"
import { Color, ActivePiece } from "./pieces/ActivePiece"

enum ColumnValues {
    A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8
}
export type Coordinate = { row: number, column: number }

export const isOnBoard = (coordinate: Coordinate) => {
    return (coordinate.row <= 8 && coordinate.row >= 1 && coordinate.column >= 1 && coordinate.column <= 8)
}

const BlackKing: ActivePiece = {
    id: "BlkK",
    hasMoved: false,
    color: Color.Black,
    piece: King,
    startingCoordinate: { row: 8, column: ColumnValues.E },
}

const WhiteKing: ActivePiece = {
    id: "WhtK",
    color: Color.White,
    hasMoved: false,
    piece: King,
    startingCoordinate: { row: 1, column: ColumnValues.E },
}

const WhiteQueen: ActivePiece = {
    id: "WhtQ",
    color: Color.White,
    piece: Queen,
    hasMoved: false,
    startingCoordinate: { row: 1, column: ColumnValues.D },
}

const BlackQueen: ActivePiece = {
    id: "BlkQ",
    color: Color.Black,
    piece: Queen,
    startingCoordinate: { row: 8, column: ColumnValues.D },
    hasMoved: false,
}

const WhiteARook: ActivePiece = {
    hasMoved: false,
    id: "WhtARook",
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: ColumnValues.A },
}

const WhiteHRook: ActivePiece = {
    id: "WhtHRook",
    hasMoved: false,
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: ColumnValues.H },
}

const BlackARook: ActivePiece = {
    id: "BlkARook",
    color: Color.Black,
    hasMoved: false,
    piece: Rook,
    startingCoordinate: { row: 8, column: ColumnValues.A },
}


const BlackHRook: ActivePiece = {
    id: "BlkHRook",
    color: Color.Black,
    hasMoved: false,
    piece: Rook,
    startingCoordinate: { row: 8, column: ColumnValues.H },
}

const WhiteBBishop: ActivePiece = {
    id: "WhtBBishop",
    color: Color.White,
    piece: Bishop,
    hasMoved: false,
    startingCoordinate: { row: 1, column: ColumnValues.B },
}


const WhiteGBishop: ActivePiece = {
    id: "WhtGBishop",
    color: Color.White,
    piece: Bishop,
    hasMoved: false,
    startingCoordinate: { row: 1, column: ColumnValues.G },
}


const BlackBBishop: ActivePiece = {
    id: "BlkBBishop",
    color: Color.Black,
    piece: Bishop,
    hasMoved: false,
    startingCoordinate: { row: 8, column: ColumnValues.B },
}


const BlackGBishop: ActivePiece = {
    id: "BlkGBishop",
    color: Color.Black,
    piece: Bishop,
    hasMoved: false,
    startingCoordinate: { row: 8, column: ColumnValues.G },
}

const WhiteCKnight: ActivePiece = {
    id: "WhtCKnight",
    hasMoved: false,
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: ColumnValues.C },
}


const WhiteFKnight: ActivePiece = {
    id: "WhtFKnight",
    color: Color.White,
    piece: Knight,
    hasMoved: false,
    startingCoordinate: { row: 1, column: ColumnValues.F },
}

const BlackCKnight: ActivePiece = {
    id: "BlkCKnight",
    color: Color.Black,
    piece: Knight,
    hasMoved: false,
    startingCoordinate: { row: 8, column: ColumnValues.C },
}


const BlackFKnight: ActivePiece = {
    id: "BlkFKnight",
    color: Color.Black,
    piece: Knight,
    hasMoved: false,
    startingCoordinate: { row: 8, column: ColumnValues.F },
}

const WhitePawns: Array<ActivePiece> = Array.from(Array(8)).map((_, i) => {
    return {
        id: `WhtPawn${i}`,
        color: Color.White,
        piece: Pawn,
        hasMoved: false,
        startingCoordinate: { row: 2, column: i + 1 },
    }
})

const BlackPawns: Array<ActivePiece> = Array.from(Array(8)).map((_, i) => {
    return {
        id: `BlkPawn${i}`,
        color: Color.Black,
        piece: Pawn,
        hasMoved: false,
        startingCoordinate: { row: 7, column: i + 1 },
    }
})


const WhitePieces = [
    WhiteKing,
    WhiteQueen,
    WhiteBBishop,
    WhiteGBishop,
    WhiteHRook,
    WhiteARook,
    WhiteCKnight,
    WhiteFKnight
].concat(WhitePawns)

const BlackPieces = [
    BlackKing,
    BlackQueen,
    BlackBBishop,
    BlackGBishop,
    BlackHRook,
    BlackARook,
    BlackCKnight,
    BlackFKnight
].concat(BlackPawns)

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
    const board: Board<ActivePiece> = emptyBoard()
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
}

export function compareCoordinates(coord1: Coordinate, coord2: Coordinate) {
    return coord1.row === coord2.row && coord1.column === coord2.column
}

export function getBoardCell(board: Board<ActivePiece>, coord: Coordinate) {
    return board[coord.row - 1][coord.column - 1]
}

function bfs(startingCoordinate: Coordinate, validMoves: Array<Coordinate>, dirs: Array<Coordinate>, board: Board<ActivePiece>) {
    const queue = [startingCoordinate]
    const blockedDirs: Set<string> = new Set([])
    const seen: Board<boolean> = emptyBoard()
    const out: Array<Coordinate> = []
    let x = 0
    console.log('here')

    while (queue.length) {
        x += 1
        const coord = queue.pop()
        console.log('theree')

        if (!coord) {
            console.error("this shouldnt happend")
            return
        }

        console.log('queue', queue)
        console.log('blocked', blockedDirs)
        dirs.forEach(dir => {
            x += 1
            if (!blockedDirs.has(`${dir.row}${dir.column}`)) {
                const nextCoord = { row: coord.row - dir.row, column: coord.column - dir.column }


                if (validMoves.some(x => x.row === nextCoord.row && x.column === nextCoord.column) && isOnBoard(nextCoord) &&
                    !seen[nextCoord.row - 1][nextCoord.column - 1]
                ) {
                    console.log('valid')

                    if (getBoardCell(board, nextCoord)) {
                        blockedDirs.add(`${dir.row}${dir.column}`)
                    }
                    else {
                        console.log('adding')
                        out.push(nextCoord)
                        queue.push(nextCoord)
                        seen[nextCoord.row - 1][nextCoord.column - 1] = true
                    }
                }
            }

        })
    }

    return out

}

export function filterBlockingMoves(startingCoordinate: Coordinate, validMoves: Array<Coordinate>, board: Board<ActivePiece>) {

    const filtered = bfs(startingCoordinate, validMoves, [
        { row: 1, column: 0 },
        { row: 0, column: 1 },
        { row: -1, column: 0 },
        { row: 0, column: -1 },

        { row: 1, column: 1 },
        { row: -1, column: -1 },
        { row: 1, column: -1 },
        { row: -1, column: 1 },
    ], board)


    return filtered
}

export function isPieceInWay(startingCoordinate: Coordinate, endCoordinate: Coordinate, board: Board<ActivePiece>): boolean {
    const isOccupied = (row: number, column: number) => {
        console.log(row)
        return board[row - 1][column - 1] !== undefined;
    }

    const checkPath = (startingCoordinate: Coordinate, endCoordinate: Coordinate, rowStep: number, colStep: number) => {
        const startRow = startingCoordinate.row
        const startCol = startingCoordinate.column

        const endRow = endCoordinate.row
        const endCol = endCoordinate.column

        for (let r = startRow + rowStep, c = startCol + colStep;
            r !== endRow || c !== endCol;
            r += rowStep, c += colStep) {
            if (!isOnBoard({ row: r, column: c })) {
                return false;
            }
            if (isOccupied(r, c)) {
                return true;
            }
        }
        return false;
    };

    if (startingCoordinate.row === endCoordinate.row) {
        // Moving horizontally
        if (startingCoordinate.column < endCoordinate.column) {
            // Moving right
            return checkPath(startingCoordinate, endCoordinate, 0, 1);
        } else {
            // Moving left
            return checkPath(startingCoordinate, endCoordinate, 0, -1);
        }
    } else if (startingCoordinate.column === endCoordinate.column) {
        // Moving vertically
        if (startingCoordinate.row < endCoordinate.row) {
            // Moving up
            return checkPath(startingCoordinate, endCoordinate, 1, 0);
        } else {
            // Moving down
            return checkPath(startingCoordinate, endCoordinate, -1, 0);
        }
    } else {
        // Moving diagonally
        const rowStep = startingCoordinate.row < endCoordinate.row ? 1 : -1;
        const colStep = startingCoordinate.column < endCoordinate.column ? 1 : -1;

        return checkPath(startingCoordinate, endCoordinate, rowStep, colStep);
    }
}

export function deselectPiece(gameState: GameState): GameState {
    return { ...gameState, selectedPiece: undefined }
}


export function movePiece(gameState: GameState, selectedPiece: SelectedPiece, newCoordinates: Coordinate): GameState {

    selectedPiece.piece.hasMoved = true

    const gameWithoutSelectedPiece  = deselectPiece(gameState)

    const newBoard = [...gameState.board]
    newBoard[selectedPiece.coordinates?.row - 1][selectedPiece?.coordinates.column - 1] = undefined
    newBoard[newCoordinates.row - 1][newCoordinates.column - 1] = selectedPiece.piece
 
    console.log(`Piece ${selectedPiece.piece.piece.name} moved from ${selectedPiece.coordinates.row} ${selectedPiece.coordinates.column} to ${newCoordinates.row} ${newCoordinates.column}`)
    return { ...gameWithoutSelectedPiece, board: newBoard }
}


export function tryMovePiece(gameState: GameState, newCoordinates: Coordinate): GameState {
    if (!gameState.selectedPiece) {
        console.log("Cannot move piece if no piece is selected");
        return gameState
    }

    console.log(`Attempting to move piece ${gameState.selectedPiece.piece.piece.name} moved from ${gameState.selectedPiece.coordinates.row} ${gameState.selectedPiece.coordinates.column} to ${newCoordinates.row} ${newCoordinates.column}`)

    console.log("Selected piece", gameState.selectedPiece)
    console.log("Selected piece moves", gameState.selectedPiece.piece.piece.moves(gameState.selectedPiece.coordinates, gameState.selectedPiece.piece.hasMoved))

    if (!gameState.selectedPiece.moves[newCoordinates.row - 1][newCoordinates.column - 1]) {
        console.log("Cannot move piece to invalid spot")
        return gameState
    }

    if (gameState.selectedPiece.piece.piece.name !== PieceName.Knight && isPieceInWay(gameState.selectedPiece.coordinates, newCoordinates, gameState.board)) {
        console.log("Piece in way")
        return gameState
    }

    const pieceAtCoordinates = gameState.board[newCoordinates.row - 1][newCoordinates.column - 1]
    const isForwardMove = gameState.selectedPiece.coordinates && gameState.selectedPiece.coordinates.column === newCoordinates.column

    if(gameState.selectedPiece.piece.piece.name === PieceName.Pawn && pieceAtCoordinates && isForwardMove) {

        console.log("Cannot move pawn on top of piece")

        return gameState
    }

    if(gameState.selectedPiece.piece.piece.name === PieceName.Pawn && !pieceAtCoordinates && !isForwardMove) {
        console.log("Cannot move pawn diagonally without capturing")
        return gameState
    }

    if (pieceAtCoordinates && pieceAtCoordinates.color === gameState.selectedPiece.piece.color) {
        console.log("Cannot move piece on top of piece of the same team")
        return gameState
    }

    return movePiece(gameState, gameState.selectedPiece, newCoordinates)
}

export function setSelectedPieceForState(gameState: GameState, coordinate: Coordinate): GameState {
    const selectedPiece = gameState.board[coordinate.row - 1][coordinate.column - 1]

    if (!selectedPiece) {
        return { ...gameState, selectedPiece: undefined }
    }
    console.log("Selecting piece")

    const pieceMoves = selectedPiece.piece.moves(coordinate, selectedPiece.hasMoved)

    if (gameState?.selectedPiece?.piece.id === gameState.board[coordinate.row - 1][coordinate.column - 1]?.id) {
        console.log("Piece already selected")
        return { ...gameState, selectedPiece: undefined }
    }
    //TODO: can i do some type magic to avoid typing it every time
    const board: Board<boolean> = emptyBoard()

    pieceMoves.forEach((move: Coordinate) => {
        board[move.row - 1][move.column - 1] = true
    })

    return { ...gameState, selectedPiece: { coordinates: coordinate, piece: selectedPiece, moves: board } }
}


export const initGameState = (): GameState => ({
    board: initBoard(),
    playerTurn: Color.White,
    selectedPiece: undefined,
})

const isDarkSquare = (row: number, column: number) => {
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
        console.log(gameState.selectedPiece?.piece.piece.moves(gameState.selectedPiece.coordinates, gameState.selectedPiece.piece.hasMoved))
    }

    const handleClick = (newCoordinates: Coordinate) => {
        const selectedPiece = gameState.selectedPiece

        if (!selectedPiece || getBoardCell(gameState.board, newCoordinates)?.color === gameState.playerTurn) {
            setGameState(setSelectedPieceForState(gameState, newCoordinates))
        } else {
            setGameState(tryMovePiece(gameState, newCoordinates))
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

                            const bgColor = isDarkSquare(row, column) ? "bg-green-800" : "bg-gray-200"
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
