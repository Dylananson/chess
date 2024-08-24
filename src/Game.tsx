import { useState } from "react"

import { PieceName } from "./pieces/PieceName"
import { createKing, King } from "./pieces/King"
import { Knight } from "./pieces/Knight"
import { Bishop } from "./pieces/Bishop"
import { Rook } from "./pieces/Rook"
import { Queen } from "./pieces/Queen"
import { createPawn, Pawn } from "./pieces/Pawn"
import { Color, ActivePiece } from "./pieces/ActivePiece"
//import { createGameState } from "./tests/movePiece.test"

export const coordToKey = (coord: Coordinate) => `${coord.row}${coord.column}`

enum ColumnValues {
    A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8
}
export type Coordinate = { row: number, column: number }

export const isOnBoard = (coordinate: Coordinate) => {
    return (coordinate.row <= 8 && coordinate.row >= 1 && coordinate.column >= 1 && coordinate.column <= 8)
}

const BlackKing: ActivePiece = {
    id: "BlkK",
    color: Color.Black,
    piece: King,
    startingCoordinate: { row: 8, column: ColumnValues.E },
    hasMoved: false
}

const WhiteKing: ActivePiece = {
    id: "WhtK",
    color: Color.White,
    piece: King,
    startingCoordinate: { row: 1, column: ColumnValues.E },
    hasMoved: false
}

const WhiteQueen: ActivePiece = {
    id: "WhtQ",
    color: Color.White,
    piece: Queen,
    startingCoordinate: { row: 1, column: ColumnValues.D },
    hasMoved: false
}

const BlackQueen: ActivePiece = {
    id: "BlkQ",
    color: Color.Black,
    piece: Queen,
    startingCoordinate: { row: 8, column: ColumnValues.D },
    hasMoved: false
}

const WhiteARook: ActivePiece = {
    id: "WhtARook",
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: ColumnValues.A },
    hasMoved: false
}

const WhiteHRook: ActivePiece = {
    id: "WhtHRook",
    color: Color.White,
    piece: Rook,
    startingCoordinate: { row: 1, column: ColumnValues.H },
    hasMoved: false
}

const BlackARook: ActivePiece = {
    id: "BlkARook",
    color: Color.Black,
    piece: Rook,
    startingCoordinate: { row: 8, column: ColumnValues.A },
    hasMoved: false
}


const BlackHRook: ActivePiece = {
    id: "BlkHRook",
    color: Color.Black,
    piece: Rook,
    startingCoordinate: { row: 8, column: ColumnValues.H },
    hasMoved: false
}

const WhiteCBishop: ActivePiece = {
    id: "WhtCBishop",
    color: Color.White,
    piece: Bishop,
    startingCoordinate: { row: 1, column: ColumnValues.C },
    hasMoved: false
}


const WhiteFBishop: ActivePiece = {
    id: "WhtFBishop",
    color: Color.White,
    piece: Bishop,
    startingCoordinate: { row: 1, column: ColumnValues.F },
    hasMoved: false
}


const BlackCBishop: ActivePiece = {
    id: "BlkCBishop",
    color: Color.Black,
    piece: Bishop,
    startingCoordinate: { row: 8, column: ColumnValues.C },
    hasMoved: false
}


const BlackFBishop: ActivePiece = {
    id: "BlkFBishop",
    color: Color.Black,
    piece: Bishop,
    startingCoordinate: { row: 8, column: ColumnValues.F },
    hasMoved: false
}

const WhiteBKnight: ActivePiece = {
    id: "WhtBKnight",
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: ColumnValues.B },
    hasMoved: false
}


const WhiteGKnight: ActivePiece = {
    id: "WhtGKnight",
    color: Color.White,
    piece: Knight,
    startingCoordinate: { row: 1, column: ColumnValues.G },
    hasMoved: false
}

const BlackBKnight: ActivePiece = {
    id: "BlkBKnight",
    color: Color.Black,
    piece: Knight,
    startingCoordinate: { row: 8, column: ColumnValues.B },
    hasMoved: false
}


const BlackGKnight: ActivePiece = {
    id: "BlkGKnight",
    color: Color.Black,
    piece: Knight,
    startingCoordinate: { row: 8, column: ColumnValues.G },
    hasMoved: false
}

const WhitePawns: Array<ActivePiece> = Array.from(Array(8)).map((_, i) => {
    return {
        id: `WhtPawn${i}`,
        color: Color.White,
        piece: Pawn,
        startingCoordinate: { row: 2, column: i + 1 },
        hasMoved: false
    }
})

const BlackPawns: Array<ActivePiece> = Array.from(Array(8)).map((_, i) => {
    return {
        id: `BlkPawn${i}`,
        color: Color.Black,
        piece: Pawn,
        startingCoordinate: { row: 7, column: i + 1 },
        hasMoved: false
    }
})


const WhitePieces = [
    WhiteKing,
    WhiteQueen,
    WhiteCBishop,
    WhiteFBishop,
    WhiteHRook,
    WhiteARook,
    WhiteBKnight,
    WhiteGKnight
].concat(WhitePawns)

const BlackPieces = [
    BlackKing,
    BlackQueen,
    BlackCBishop,
    BlackFBishop,
    BlackHRook,
    BlackARook,
    BlackBKnight,
    BlackGKnight
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

export type SelectedPiece = {
    piece: ActivePiece,
    coordinates: Coordinate,
    moves: Board<boolean>
}

export type GameState = {
    board: Board<ActivePiece>
    selectedPiece?: SelectedPiece
    playerTurn: Color
    inCheck: boolean
    history: Array<Board<ActivePiece>>
    historyIndex: number
}

export function findKing(board: Board<ActivePiece>, color: Color) {
    let king: ActivePiece | undefined;
    let kingCoordinate: Coordinate | undefined;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            const piece = board[row][col]
            if (piece?.color === color && piece?.piece?.name === PieceName.King) {
                king = piece
                kingCoordinate = { row: row + 1, column: col + 1 }
                break
            }
        }
        if (king) break;
    }

    if (!king || !kingCoordinate) {
        return undefined
    }
    return kingCoordinate
}

export function isAttacked(board: Board<ActivePiece>, color: Color, coordinate: Coordinate) {
    let allMoves: Array<Coordinate> = [];

    board.forEach((row, ri) => {
        row.forEach((p, ci) => {
            const coord = { row: ri + 1, column: ci + 1 }
            if (p?.color !== color) {
                const moves = p?.piece.moves(board, coord)
                if (moves) {
                    allMoves = allMoves.concat(moves)
                }
            }
        })
    })

    return allMoves.some(move => compareCoordinates(move, coordinate))
}

export function isCheck(board: Board<ActivePiece>, color: Color) {
    const kingCoordinate = findKing(board, color)

    if (!kingCoordinate) {
        console.error("King not found")
        return false
    }

    let allMoves: Array<Coordinate> = [];

    board.forEach((row, ri) => {
        row.forEach((p, ci) => {
            const coordinate = { row: ri + 1, column: ci + 1 }
            if (p?.color !== color) {
                const moves = p?.piece.moves(board, coordinate)
                if (moves) {
                    allMoves = allMoves.concat(moves)
                }
            }
        })
    })

    return allMoves.some(move => compareCoordinates(move, kingCoordinate))
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

    while (queue.length) {
        x += 1
        const coord = queue.pop()

        if (!coord) {
            console.error("this shouldnt happend")
            return
        }

        dirs.forEach(dir => {
            x += 1
            if (!blockedDirs.has(`${dir.row}${dir.column}`)) {
                const nextCoord = { row: coord.row - dir.row, column: coord.column - dir.column }


                if (validMoves.some(x => x.row === nextCoord.row && x.column === nextCoord.column) && isOnBoard(nextCoord) &&
                    !seen[nextCoord.row - 1][nextCoord.column - 1]
                ) {

                    if (getBoardCell(board, nextCoord)) {
                        blockedDirs.add(`${dir.row}${dir.column}`)
                    }
                    else {
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

export function deepCopyBoard<T>(board: Board<T>): Board<T> {
    return board.map(arr => arr.slice())
}


export function movePiece(board: Board<ActivePiece>, selectedPiece: SelectedPiece, newCoordinates: Coordinate): Board<ActivePiece> {
    const newBoard = deepCopyBoard(board)
    newBoard[selectedPiece.coordinates?.row - 1][selectedPiece?.coordinates.column - 1] = undefined
    newBoard[newCoordinates.row - 1][newCoordinates.column - 1] = selectedPiece.piece

    return newBoard
}


export const createBoard = (pieces: Array<ActivePiece>) => {
    const board: Board<ActivePiece> = emptyBoard()
    pieces.forEach(piece => {
        board[piece.startingCoordinate.row - 1][piece.startingCoordinate.column - 1] = piece
    })
    return board
}

export function isLegalMove(board: Board<ActivePiece>, oldCoordinates: Coordinate, newCoordinates: Coordinate): boolean {
    const piece = getBoardCell(board, oldCoordinates)

    if (!piece) {
        console.error("Piece not found")
        return false
    }

    const pieceMoves = piece.piece.moves(board, oldCoordinates)
    const moves: Board<boolean> = emptyBoard()

    pieceMoves.forEach((move: Coordinate) => {
        moves[move.row - 1][move.column - 1] = true
    })

    if (!moves[newCoordinates.row - 1][newCoordinates.column - 1]) {
        console.log("Cannot move piece to invalid spot")
        return false
    }

    const pieceAtNewCoordinates = board[newCoordinates.row - 1][newCoordinates.column - 1]

    if (pieceAtNewCoordinates && pieceAtNewCoordinates.color === piece.color) {
        console.log("Cannot move piece on top of piece of the same team")
        return false
    }

    const newBoard = deepCopyBoard(board)
    newBoard[oldCoordinates?.row - 1][oldCoordinates.column - 1] = undefined
    newBoard[newCoordinates.row - 1][newCoordinates.column - 1] = piece

    if (isCheck(newBoard, piece.color)) {
        console.log("Cannot move piece in check")
        return false
    }

    return true
}


export function tryMovePiece(gameState: GameState, newCoordinates: Coordinate): GameState {
    if (!gameState.selectedPiece) {
        console.log("Cannot move piece if no piece is selected");
        return gameState
    }

    if (gameState.selectedPiece.piece.color !== gameState.playerTurn) {
        console.log("Cannot move piece on other players turn")
        return gameState
    }

    if (!gameState.selectedPiece) {
        console.error("No piece selected")
        return gameState
    }

    const canMove = isLegalMove(gameState.board, gameState.selectedPiece.coordinates, newCoordinates)

    if (!canMove) {
        console.log("Cannot move piece")
        return gameState
    }

    const newBoard = deepCopyBoard(gameState.board)
    newBoard[gameState.selectedPiece.coordinates?.row - 1][gameState.selectedPiece?.coordinates.column - 1] = undefined
    newBoard[newCoordinates.row - 1][newCoordinates.column - 1] = gameState.selectedPiece.piece

    const newGame = {
        ...gameState,
        get board(): Board<ActivePiece> {
            return this.history[this.history.length - 1]
        },
        selectedPiece: undefined,
        playerTurn: gameState.playerTurn === Color.White ? Color.Black : Color.White,
        historyIndex: gameState.historyIndex + 1,
        history: [...gameState.history, newBoard],
    }

    return newGame
}


export function filterPieceMovesThatPutKingInCheck(board: Board<ActivePiece>, coordinate: Coordinate, moves: Array<Coordinate>) {
    const newBoard = deepCopyBoard(board)

    const piece = getBoardCell(newBoard, coordinate)

    if (!piece) {
        console.error("Piece not found")
        return []
    }

    const validMoves = moves.filter(move => {
        const newBoard = deepCopyBoard(board)
        newBoard[coordinate.row - 1][coordinate.column - 1] = undefined
        newBoard[move.row - 1][move.column - 1] = piece

        const checked = isCheck(newBoard, piece.color)

        return !checked
    })

    return validMoves
}

export function filterMovesOntopOfSameColor(board: Board<ActivePiece>, moves: Array<Coordinate>, color: Color) {
    return moves.filter(move => {
        const piece = getBoardCell(board, move)

        return !piece || piece.color !== color
    })
}

export function hasLegalMove(board: Board<ActivePiece>, color: Color) {
    return getLegalMoves(board, color).length > 0
}

export function getLegalMoves(board: Board<ActivePiece>, color: Color) {
    const legalMoves: Array<Coordinate> = []

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            const piece = board[row][col]
            if (piece?.color === color) {
                const moves = piece?.piece.moves(board, { row: row + 1, column: col + 1 })
                if (moves) {
                    const nonCheckedMoves = filterPieceMovesThatPutKingInCheck(board, { row: row + 1, column: col + 1 }, moves)
                    const validMoves = filterMovesOntopOfSameColor(board, nonCheckedMoves, color)

                    validMoves.forEach(move => {
                        legalMoves.push(move)
                    })
                }
            }
        }
    }
    return legalMoves
}


export function isCheckMate(board: Board<ActivePiece>, color: Color) {
    const checked = isCheck(board, color)

    const hasLegalMoves = hasLegalMove(board, color)

    return checked && !hasLegalMoves;
}

export function isStaleMate(board: Board<ActivePiece>, color: Color) {
    const checked = isCheck(board, color)

    return !checked && !hasLegalMove(board, color);
}

export function selectPiece(gameState: GameState, coordinate: Coordinate): GameState {
    const selectedPiece = gameState.board[coordinate.row - 1][coordinate.column - 1]

    if (!selectedPiece) {
        return { ...gameState, selectedPiece: undefined }
    }
    console.log("Selecting piece")

    const filteredCheckMoves = filterPieceMovesThatPutKingInCheck(gameState.board, coordinate, selectedPiece.piece.moves(gameState.board, coordinate))

    const pieceMoves = filterMovesOntopOfSameColor(gameState.board, filteredCheckMoves, selectedPiece.color)


    if (gameState?.selectedPiece?.piece.id === gameState.board[coordinate.row - 1][coordinate.column - 1]?.id) {
        console.log("Piece already selected")
        return { ...gameState, selectedPiece: undefined }
    }
    const board: Board<boolean> = emptyBoard()

    pieceMoves.forEach((move: Coordinate) => {
        board[move.row - 1][move.column - 1] = true
    })

    return { ...gameState, selectedPiece: { coordinates: coordinate, piece: selectedPiece, moves: board } }
}


export const getInitGameState = (): GameState => ({
    get board() {
        return this.history[this.history.length - 1]
    },
    playerTurn: Color.White,
    selectedPiece: undefined,
    inCheck: false,
    history: [initBoard()],
    historyIndex: 0
})

const isDarkSquare = (row: number, column: number) => {
    if (row % 2 === 0) {
        return column % 2 === 0
    } else {
        return column % 2 === 1
    }
}

type PromotionProps = {
    handleClick: (name: PieceName) => void
}

//type MovesFunction = (board: Board<ActivePiece>, coorinates: Coordinate) => Array<Coordinate>

const PromotionModal = ({ handleClick }: PromotionProps) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md">
                <h2 className="text-2xl font-semibold">Promote pawn</h2>
                <div className="flex justify-center">
                    <button onClick={() => handleClick(PieceName.Queen)} className="m-2 p-2 bg-green-500 rounded-md">Queen</button>
                    <button onClick={() => handleClick(PieceName.Rook)} className="m-2 p-2 bg-green-500 rounded-md">Rook</button>
                    <button onClick={() => handleClick(PieceName.Bishop)} className="m-2 p-2 bg-green-500 rounded-md">Bishop</button>
                    <button onClick={() => handleClick(PieceName.Knight)} className="m-2 p-2 bg-green-500 rounded-md">Knight</button>
                </div>
            </div>
        </div>
    )
}

export const hasCastlingRights = (king: ActivePiece, rook: ActivePiece, board: Board<ActivePiece>) => {
    if(king.hasMoved || rook.hasMoved){
        return false
    }
    const kingSide = rook.startingCoordinate.column === 8
    if(kingSide){
        for(let i = king.startingCoordinate.column + 1; i < rook.startingCoordinate.column; i++){
            if(board[king.startingCoordinate.row - 1][i - 1]){
                return false
            }
            if(isAttacked(board, king.color, {row: king.startingCoordinate.row, column: i})){
                return false
            }
        }
    }
    return true
}


export function Game({ initGameState }: { initGameState: GameState }) {
    const [gameState, setGameState] = useState<GameState>(initGameState)
    const [canPromote, setCanPromote] = useState<Coordinate | undefined>(undefined)
    const rows = [1, 2, 3, 4, 5, 6, 7, 8]
    const columns = [1, 2, 3, 4, 5, 6, 7, 8]

    if (gameState.selectedPiece) {
        //console.log(gameState.selectedPiece?.piece.piece.moves(gameState.board, gameState.selectedPiece.coordinates))
    }

    const handlePromotion = (name: PieceName) => {
        console.log("Promoting to", name)

        const newBoard = deepCopyBoard(gameState.board)
        if (!canPromote) {
            console.error("Cannot promote")
            return
        }

        let newPiece;

        switch (name) {
            case PieceName.Queen:
                newPiece = Queen
                break;
            case PieceName.Rook:
                newPiece = Rook
                break;
            case PieceName.Bishop:
                newPiece = Bishop
                break;
            case PieceName.Knight:
                newPiece = Knight
                break;
            default:
                console.error("Invalid piece")
                return
        }

        newBoard[canPromote?.row - 1][canPromote?.column - 1] = {
            id: "Promoted piece",
            color: gameState.playerTurn === Color.Black ? Color.White : Color.Black,
            piece: newPiece,
            startingCoordinate: canPromote,
            hasMoved: true
        }

        setGameState({
            ...gameState,
            board: newBoard
        })
        setCanPromote(undefined)
    }

    const handleClick = (newCoordinates: Coordinate) => {
        if (gameState.historyIndex !== gameState.history.length - 1) {
            return
        }
        const selectedPiece = gameState.selectedPiece
        let newGame;

        if (!selectedPiece || getBoardCell(gameState.board, newCoordinates)?.color === gameState.playerTurn) {
            newGame = selectPiece(gameState, newCoordinates)
        } else {

            const piece = gameState.selectedPiece?.piece

            const isPawn = piece?.piece.name === PieceName.Pawn

            newGame = tryMovePiece(gameState, newCoordinates)

            if (isPawn && (newCoordinates.row === 1 || newCoordinates.row === 8)) {
                setCanPromote(newCoordinates)
            }
        }

        console.log("Player turn", newGame.playerTurn)
        console.log("Check", isCheck(newGame.board, newGame.playerTurn))
        console.log("has legal move", hasLegalMove(newGame.board, newGame.playerTurn))
        console.log("stalemate", isStaleMate(newGame.board, newGame.playerTurn))
        console.log("legal moves", getLegalMoves(newGame.board, newGame.playerTurn))
        setGameState(newGame)

        if (isCheckMate(newGame.board, newGame.playerTurn)) {
            console.log("Checkmate")
            alert("Checkmate")

            setGameState(getInitGameState())
        }

    }

    function handleShowPreviousState(): void {
        if (gameState.historyIndex === 0) {
            return
        }
        setGameState({ ...gameState, historyIndex: gameState.historyIndex - 1 })
    }

    function handleShowNextState(): void {
        setGameState({ ...gameState, historyIndex: gameState.historyIndex + 1 })
    }

    return (
        <>
            {canPromote ? <PromotionModal handleClick={handlePromotion} /> : <></>}

            <div className="b-4 contents-center center justify-center justify-items-center place-items-center">
                {rows.reverse().map((row) => (
                    <div key={row} className="flex justify-items-center place-items-center">
                        {columns.map((column) => {
                            let p;
                            if (gameState.historyIndex !== gameState.history.length - 1) {
                                p = gameState.history[gameState.historyIndex][row - 1][column - 1]
                            } else {
                                p = gameState.board[row - 1][column - 1]
                            }

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

            <div className="m-2">
                {
                    //TODO: fix this stuff
                    gameState.historyIndex > 0 ?
                        <button className="rounded-md bg-blue-500 p-2 font-semibold" onClick={handleShowPreviousState}> prev </button> :
                        <button className="rounded-md bg-blue-100 p-2 font-semibold"> prev </button>}

                {gameState.historyIndex < gameState.history.length - 1 ?
                    <button className="rounded-md bg-blue-500 p-2 font-semibold" onClick={handleShowNextState}> next </button> :
                    <button className="rounded-md bg-blue-100 p-2 font-semibold"> next </button>
                }
            </div >
        </>
    )
}

export const createGameState = (board: Board<ActivePiece>, selectedPiece: SelectedPiece | undefined, playerTurn: Color, inCheck: boolean, history?: Array<Board<ActivePiece>>): GameState => {
    return {
        board,
        selectedPiece,
        playerTurn,
        inCheck,
        history: history ?? [board],
        historyIndex: 0
    }
}

//const initGame = initGameState()
//
const pawn = createPawn(Color.White, { row: 7, column: 1 })
const blackKing = createKing(Color.Black, { row: 8, column: 5 })
const whiteKing = createKing(Color.White, { row: 1, column: 5 })

const b = createBoard([pawn, blackKing, whiteKing])

const initGame = createGameState(b, undefined, Color.White, false)

export function InitGame() {
    return (
        <div>
            <Game initGameState={getInitGameState()} />
        </div>
    )
}

export default InitGame
