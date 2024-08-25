import { useState } from "react"

import { PieceName } from "./pieces/PieceName"
import { createKnight } from "./pieces/Knight"
import { createBishop } from "./pieces/Bishop"
import { createRook } from "./pieces/Rook"
import { createQueen } from "./pieces/Queen"
import { Color } from "./pieces/ActivePiece"
import { defaultGame } from "./utils/gameStates"
import { deepCopyBoard, getBoardCell, isCheck, hasLegalMove, isStalemate, getLegalMoves, isCheckMate} from "./Board"
import { Coordinate } from "./Coordinate"
import { GameState, selectPiece } from "./GameState"

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

            newGame = gameState.movePiece(newCoordinates)

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
