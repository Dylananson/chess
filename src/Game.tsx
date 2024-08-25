import { useState } from "react"

import { PieceName } from "./pieces/PieceName"
import { createKnight } from "./pieces/Knight"
import { createBishop } from "./pieces/Bishop"
import { createRook } from "./pieces/Rook"
import { createQueen } from "./pieces/Queen"
import { Color, ActivePiece } from "./pieces/ActivePiece"
import { defaultGame } from "./utils/gameStates"
import { emptyBoard, Board, isOnBoard, deepCopyBoard, getBoardCell, isCheck, findKing, isAttacked, filterMovesOntopOfSameColor, hasLegalMove, isStalemate, getLegalMoves, isCheckMate } from "./Board"
import { Coordinate } from "./Coordinate"

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


export function movePiece(board: Board<ActivePiece>, selectedPiece: SelectedPiece, newCoordinates: Coordinate): Board<ActivePiece> {
    const newBoard = deepCopyBoard(board)
    newBoard[selectedPiece.coordinates?.row - 1][selectedPiece?.coordinates.column - 1] = undefined
    newBoard[newCoordinates.row - 1][newCoordinates.column - 1] = selectedPiece.piece

    return newBoard
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

export const isCastleKingSide = (board: Board<ActivePiece>, oldCoordinates: Coordinate, newCoordinates: Coordinate) => {
    if (getBoardCell(board, oldCoordinates)?.piece.name !== PieceName.King) {
        return false
    }
    return oldCoordinates.column === 5 && newCoordinates.column === 7
}

export const isCastleQueenSide = (board: Board<ActivePiece>, oldCoordinates: Coordinate, newCoordinates: Coordinate) => {
    if (getBoardCell(board, oldCoordinates)?.piece.name !== PieceName.King) {
        return false
    }
    return oldCoordinates.column === 5 && newCoordinates.column === 3
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

    const isCastleKingSideMove = isCastleKingSide(gameState.board, gameState.selectedPiece.coordinates, newCoordinates)

    if (isCastleKingSideMove && canCastleKingSide(gameState.board, gameState.selectedPiece.piece.color)) {
        return {
            ...gameState,
            history: [...gameState.history, castleKingSide(gameState.board, gameState.selectedPiece.piece.color)],
            get board(): Board<ActivePiece> {
                return this.history[this.history.length - 1]
            },
            selectedPiece: undefined,
            playerTurn: gameState.playerTurn === Color.White ? Color.Black : Color.White,
            historyIndex: gameState.historyIndex + 1,
        }
    }

    const isCastleQueenSideMove = isCastleQueenSide(gameState.board, gameState.selectedPiece.coordinates, newCoordinates)

    if (isCastleQueenSideMove && canCastleQueenSide(gameState.board, gameState.selectedPiece.piece.color)) {
        return {
            ...gameState,
            get board(): Board<ActivePiece> {
                return this.history[this.history.length - 1]
            },
            history: [...gameState.history, castleQueenSide(gameState.board, gameState.selectedPiece.piece.color)],
            selectedPiece: undefined,
            playerTurn: gameState.playerTurn === Color.White ? Color.Black : Color.White,
            historyIndex: gameState.historyIndex + 1,
        }
    }

    const canMove = isLegalMove(gameState.board, gameState.selectedPiece.coordinates, newCoordinates)

    if (!canMove) {
        console.log("Cannot move piece")
        return gameState
    }

    const newBoard = deepCopyBoard(gameState.board)

    newBoard[gameState.selectedPiece.coordinates?.row - 1][gameState.selectedPiece?.coordinates.column - 1] = undefined
    newBoard[newCoordinates.row - 1][newCoordinates.column - 1] = { ...gameState.selectedPiece.piece, hasMoved: true }

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

export function selectPiece(gameState: GameState, coordinate: Coordinate): GameState {
    const selectedPiece = gameState.board[coordinate.row - 1][coordinate.column - 1]

    if (!selectedPiece) {
        return { ...gameState, selectedPiece: undefined }
    }
    console.log("Selecting piece")

    const filteredCheckMoves = filterPieceMovesThatPutKingInCheck(gameState.board, coordinate, selectedPiece.piece.moves(gameState.board, coordinate))

    const pieceMoves = filterMovesOntopOfSameColor(gameState.board, filteredCheckMoves, selectedPiece.color)

    if (selectedPiece.piece.name === PieceName.King) {
        if (canCastleQueenSide(gameState.board, selectedPiece.color)) {
            pieceMoves.push({ row: selectedPiece.startingCoordinate.row, column: 3 })
        }

        if (canCastleKingSide(gameState.board, selectedPiece.color)) {
            console.log("Can castle king side")
            pieceMoves.push({ row: selectedPiece.startingCoordinate.row, column: 7 })
        }
    }


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

export const canCastleQueenSide = (board: Board<ActivePiece>, color: Color) => {
    if (isCheck(board, color)) {
        return false
    }
    const kingCoordinates = findKing(board, color)

    if (!kingCoordinates) {
        return false
    }

    const king = getBoardCell(board, kingCoordinates)

    if (!king) {
        return false
    }

    const rook = getBoardCell(board, { row: king.startingCoordinate.row, column: 1 })

    if (!rook) {
        return false
    }

    if (king.hasMoved || rook.hasMoved) {
        return false
    }

    for (let i = king.startingCoordinate.column - 1; i > rook.startingCoordinate.column; i--) {
        if (board[king.startingCoordinate.row - 1][i - 1]) {
            return false
        }
        if (isAttacked(board, king.color, { row: king.startingCoordinate.row, column: i })) {
            return false
        }
    }

    return true
}


export const canCastleKingSide = (board: Board<ActivePiece>, color: Color) => {
    if (isCheck(board, color)) {
        return false
    }
    const kingCoordinates = findKing(board, color)

    if (!kingCoordinates) {
        return false
    }

    const king = getBoardCell(board, kingCoordinates)

    if (!king) {
        return false
    }

    const rook = getBoardCell(board, { row: king.startingCoordinate.row, column: 8 })

    if (!rook) {
        return false
    }

    if (king.hasMoved || rook.hasMoved) {
        return false
    }

    for (let i = king.startingCoordinate.column + 1; i < rook.startingCoordinate.column; i++) {
        if (board[king.startingCoordinate.row - 1][i - 1]) {
            return false
        }
        if (isAttacked(board, king.color, { row: king.startingCoordinate.row, column: i })) {
            return false
        }
    }

    return true
}


export const castleQueenSide = (board: Board<ActivePiece>, color: Color) => {
    const newBoard = deepCopyBoard(board)
    const kingCoordinates = findKing(board, color)

    if (!kingCoordinates) {
        return board
    }

    const king = getBoardCell(board, kingCoordinates)

    if (!king) {
        return board
    }

    const rook = getBoardCell(board, { row: king.startingCoordinate.row, column: 1 })

    if (!rook) {
        return board
    }

    if (!canCastleQueenSide(board, color)) {
        return board
    }

    newBoard[king.startingCoordinate.row - 1][king.startingCoordinate.column - 1] = undefined
    newBoard[king.startingCoordinate.row - 1][king.startingCoordinate.column - 2 - 1] = king.move()
    newBoard[king.startingCoordinate.row - 1][1 - 1] = undefined
    newBoard[king.startingCoordinate.row - 1][4 - 1] = rook.move()

    return newBoard
}

export const castleKingSide = (board: Board<ActivePiece>, color: Color) => {
    const newBoard = deepCopyBoard(board)
    const kingCoordinates = findKing(board, color)

    if (!kingCoordinates) {
        return board
    }

    const king = getBoardCell(board, kingCoordinates)

    if (!king) {
        return board
    }

    const rook = getBoardCell(board, { row: king.startingCoordinate.row, column: 8 })

    if (!rook) {
        return board
    }

    if (!canCastleKingSide(board, color)) {
        return board
    }

    newBoard[king.startingCoordinate.row - 1][king.startingCoordinate.column - 1] = undefined
    newBoard[king.startingCoordinate.row - 1][king.startingCoordinate.column + 2 - 1] = king.move()

    newBoard[king.startingCoordinate.row - 1][8 - 1] = undefined
    newBoard[king.startingCoordinate.row - 1][6 - 1] = rook.move()

    return newBoard
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
                newPiece = { ...createQueen(gameState.playerTurn === Color.Black ? Color.White : Color.Black, canPromote), hasMoved: true }
                break;
            case PieceName.Rook:
                newPiece = { ...createRook(gameState.playerTurn === Color.Black ? Color.White : Color.Black, canPromote), hasMoved: true }
                break;
            case PieceName.Bishop:
                newPiece = { ...createBishop(gameState.playerTurn === Color.Black ? Color.White : Color.Black, canPromote), hasMoved: true }
                break;
            case PieceName.Knight:
                newPiece = { ...createKnight(gameState.playerTurn === Color.Black ? Color.White : Color.Black, canPromote), hasMoved: true }
                break;
            default:
                console.error("Invalid piece")
                return
        }

        newBoard[canPromote?.row - 1][canPromote?.column - 1] = newPiece

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
        console.log("stalemate", isStalemate(newGame.board, newGame.playerTurn))
        console.log("legal moves", getLegalMoves(newGame.board, newGame.playerTurn))
        setGameState(newGame)

        if (isCheckMate(newGame.board, newGame.playerTurn)) {
            console.log("Checkmate")
            alert("Checkmate")

            setGameState(defaultGame())
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

export function InitGame() {
    return (
        <div>
            <Game initGameState={defaultGame()} />
        </div>
    )
}

export default InitGame
