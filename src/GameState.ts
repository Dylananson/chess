import { Board, canCastleKingSide, canCastleQueenSide, castleKingSide, castleQueenSide, deepCopyBoard, emptyBoard, filterMovesOntopOfSameColor, getBoardCell,  isCheck, isLegalMove } from "./Board"
import { Coordinate } from "./Coordinate"
import { ActivePiece, Color } from "./pieces/ActivePiece"
import { PieceName } from "./pieces/PieceName"

export type GameState = {
    board: Board<ActivePiece>
    selectedPiece?: SelectedPiece
    playerTurn: Color
    inCheck: boolean
    history: Array<Board<ActivePiece>>
    historyIndex: number
    movePiece: (newCoordinates: Coordinate) => GameState
}


export type SelectedPiece = {
    piece: ActivePiece,
    coordinates: Coordinate,
    moves: Board<boolean>
}


export const createGameState = (board: Board<ActivePiece>, selectedPiece: SelectedPiece | undefined, playerTurn: Color, inCheck: boolean, history?: Array<Board<ActivePiece>>): GameState => {
    return {
        board,
        selectedPiece,
        playerTurn,
        inCheck,
        history: history ?? [board],
        historyIndex: 0,
        movePiece(newCoordinates: Coordinate) {
            return tryMovePiece(this, newCoordinates)
        }
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





