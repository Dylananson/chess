import { Board, canCastleKingSide, canCastleQueenSide, deepCopyBoard, emptyBoard, filterMovesOntopOfSameColor, getBoardCell, isCheck, NewBoard } from "./Board"
import { Coordinate } from "./Coordinate"
import { ActivePiece, Color } from "./pieces/ActivePiece"
import { PieceName } from "./pieces/PieceName"

export type GameState = {
    board:  NewBoard,
    selectedPiece?: SelectedPiece
    playerTurn: Color
    inCheck: boolean
    history: Array<NewBoard>
    historyIndex: number
    movePiece: (newCoordinates: Coordinate) => GameState
    getPiece: (coordinate: Coordinate) => ActivePiece | undefined
    selectPiece: (coordinate: Coordinate) => GameState
}


export type SelectedPiece = {
    piece: ActivePiece,
    coordinates: Coordinate,
    moves: Board<boolean>
}


export const createGameState = (
    board: NewBoard,
    selectedPiece: SelectedPiece | undefined,
    playerTurn: Color,
    inCheck: boolean,
    history?: Array<NewBoard>
): GameState => {
    return {
        selectedPiece,
        playerTurn,
        inCheck,
        history: history ?? [board],
        historyIndex: 0,
        movePiece(newCoordinates: Coordinate) {
            return tryMovePiece(this, newCoordinates)
        },
        getPiece(coordinate: Coordinate) {
            return this.board.getPiece(coordinate)
        },
        selectPiece(coordinate: Coordinate) {
            return selectPiece(this, coordinate)
        },
        board : board
    }
}


export function deselectPiece(gameState: GameState): GameState {
    return { ...gameState, selectedPiece: undefined }
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

    const isCastleKingSideMove = isCastleKingSide(gameState.board.board, gameState.selectedPiece.coordinates, newCoordinates)

    if (isCastleKingSideMove && canCastleKingSide(gameState.board.board, gameState.selectedPiece.piece.color)) {
        return {
            ...gameState,
            history: [...gameState.history, gameState.board.castleKingSide(gameState.selectedPiece.piece.color)],
            get board(): NewBoard {
                return this.history[this.history.length - 1]
            },
            selectedPiece: undefined,
            playerTurn: gameState.playerTurn === Color.White ? Color.Black : Color.White,
            historyIndex: gameState.historyIndex + 1,
        }
    }

    const isCastleQueenSideMove = isCastleQueenSide(gameState.board.board, gameState.selectedPiece.coordinates, newCoordinates)

    if (isCastleQueenSideMove && gameState.board.canCastleQueenSide(gameState.selectedPiece.piece.color)) {
        return {
            ...gameState,
            get board(): NewBoard {
                return this.history[this.history.length - 1]
            },
            history: [...gameState.history, gameState.board.castleQueenSide(gameState.selectedPiece.piece.color)],
            selectedPiece: undefined,
            playerTurn: gameState.playerTurn === Color.White ? Color.Black : Color.White,
            historyIndex: gameState.historyIndex + 1,
        }
    }

    const canMove = gameState.board.isLegalMove(gameState.selectedPiece.coordinates, newCoordinates)

    if (!canMove) {
        console.log("Cannot move piece")
        return gameState
    }

    const newGame = {
        ...gameState,
        get board(): NewBoard {
            return this.history[this.history.length - 1]
        },
        selectedPiece: undefined,
        playerTurn: gameState.playerTurn === Color.White ? Color.Black : Color.White,
        historyIndex: gameState.historyIndex + 1,
        history: [...gameState.history, gameState.board.move(gameState.selectedPiece.coordinates, newCoordinates)],
    }

    return newGame
}



export function filterPieceMovesThatPutKingInCheck(board: NewBoard, coordinate: Coordinate, moves: Array<Coordinate>) {
    const piece = board.getPiece(coordinate)

    if (!piece) {
        console.error("Piece not found")
        return []
    }

    const validMoves = moves.filter(move => {
        return !board.move(coordinate, move).isCheck(piece.color)
    })

    return validMoves
}

export function selectPiece(gameState: GameState, coordinate: Coordinate): GameState {
    const selectedPiece = gameState.getPiece(coordinate)

    if (!selectedPiece) {
        return { ...gameState, selectedPiece: undefined }
    }
    console.log("Selecting piece")

    const filteredCheckMoves = filterPieceMovesThatPutKingInCheck(gameState.board, coordinate, selectedPiece.piece.moves(gameState.board.board, coordinate))

    const pieceMoves = filterMovesOntopOfSameColor(gameState.board, filteredCheckMoves, selectedPiece.color)

    if (selectedPiece.piece.name === PieceName.King) {
        if (canCastleQueenSide(gameState.board.board, selectedPiece.color)) {
            pieceMoves.push({ row: selectedPiece.startingCoordinate.row, column: 3 })
        }

        if (canCastleKingSide(gameState.board.board, selectedPiece.color)) {
            console.log("Can castle king side")
            pieceMoves.push({ row: selectedPiece.startingCoordinate.row, column: 7 })
        }
    }

    if (gameState?.selectedPiece?.piece.id === gameState.getPiece(coordinate)?.id) {
        console.log("Piece already selected")
        return { ...gameState, selectedPiece: undefined }
    }
    const board: Board<boolean> = emptyBoard()

    pieceMoves.forEach((move: Coordinate) => {
        board[move.row - 1][move.column - 1] = true
    })

    return { ...gameState, selectedPiece: { coordinates: coordinate, piece: selectedPiece, moves: board } }
}





