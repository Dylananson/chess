import { emptyBoard, filterMovesOntopOfSameColor, getBoardCell, BoardArray, Board, Coordinate } from "./Board"
import { ActivePiece, Color } from "./pieces/ActivePiece"
import { PieceName } from "./pieces/PieceName"

export type GameState = {
    board: Board,
    selectedPiece?: SelectedPiece
    playerTurn: Color
    history: Array<Board>
    historyIndex: number
    move: (oldCoordinates: Coordinate, newCoordinates: Coordinate) => GameState
    getPiece: (coordinate: Coordinate) => ActivePiece | undefined
    selectPiece: (coordinate: Coordinate) => GameState,
    castleKingSide: (color: Color) => GameState
    castleQueenSide: (color: Color) => GameState
    promotePawn: (coordinate: Coordinate, pieceName: PieceName) => GameState
    with: (newBoard: Board) => GameState
}


export type SelectedPiece = {
    piece: ActivePiece,
    coordinates: Coordinate,
    moves: BoardArray<boolean>
}


export const createGameState = (
    board: Board,
    selectedPiece: SelectedPiece | undefined,
    playerTurn: Color,
    history?: Array<Board>
): GameState => {
    return {
        selectedPiece,
        playerTurn,
        history: history ?? [board],
        historyIndex: 0,
        promotePawn(coordinate: Coordinate, pieceName: PieceName) {
            const oldHistory = this.history.slice(0, this.historyIndex)
            return {
                ...this,
                get board(): Board {
                    return this.history[this.history.length - 1]
                },
                history: [...oldHistory, this.board.promotePawn(coordinate, pieceName)],
                selectedPiece: undefined,
                historyIndex: this.historyIndex,
            }
        },
        move(oldCoordinates: Coordinate, newCoordinates: Coordinate) {
            return movePiece(this, oldCoordinates, newCoordinates)
        },
        with(newBoard: Board) {
            return {
                ...this,
                get board(): Board {
                    return this.history[this.history.length - 1]
                },
                history: [...this.history, newBoard],
                selectedPiece: undefined,
                playerTurn: this.playerTurn === Color.White ? Color.Black : Color.White,
                historyIndex: this.historyIndex + 1,
            }
        },
        getPiece(coordinate: Coordinate) {
            return this.board.getPiece(coordinate)
        },
        selectPiece(coordinate: Coordinate) {
            return selectPiece(this, coordinate)
        },
        castleKingSide(color: Color) {
            return this.with(this.board.castleKingSide(color))
        },
        castleQueenSide(color: Color) {
            return this.with(this.board.castleQueenSide(color))
        },

        board: board
    }
}

function movePiece(gameState: GameState, oldCoordinates: Coordinate | undefined, newCoordinates: Coordinate): GameState {
    if (!oldCoordinates) {
        return gameState
    }
    const piece = gameState.getPiece(oldCoordinates)
    if (!piece) {
        console.log("Cannot move piece if no piece is selected");
        return gameState
    }

    if (piece.color !== gameState.playerTurn) {
        console.log("Cannot move piece on other players turn")
        return gameState
    }

    const isCastleKingSideMove = isCastleKingSide(gameState.board.board, oldCoordinates, newCoordinates)

    if (isCastleKingSideMove && gameState.board.canCastleKingSide(piece.color)) {
        return gameState.castleKingSide(piece.color)
    }

    const isCastleQueenSideMove = isCastleQueenSide(gameState.board.board, oldCoordinates, newCoordinates)

    if (isCastleQueenSideMove && gameState.board.canCastleQueenSide(piece.color)) {
        return gameState.castleQueenSide(piece.color)
    }

    const canMove = gameState.board.isLegalMove(oldCoordinates, newCoordinates)

    if (!canMove) {
        console.log("Cannot move piece")
        return gameState
    }

    return gameState.with(gameState.board.move(oldCoordinates, newCoordinates))
}


function deselectPiece(gameState: GameState): GameState {
    return { ...gameState, selectedPiece: undefined }
}


const isCastleKingSide = (board: BoardArray<ActivePiece>, oldCoordinates: Coordinate, newCoordinates: Coordinate) => {
    if (getBoardCell(board, oldCoordinates)?.piece.name !== PieceName.King) {
        return false
    }
    return oldCoordinates.column === 5 && newCoordinates.column === 7
}

const isCastleQueenSide = (board: BoardArray<ActivePiece>, oldCoordinates: Coordinate, newCoordinates: Coordinate) => {
    if (getBoardCell(board, oldCoordinates)?.piece.name !== PieceName.King) {
        return false
    }
    return oldCoordinates.column === 5 && newCoordinates.column === 3
}


export function filterPieceMovesThatPutKingInCheck(board: Board, coordinate: Coordinate, moves: Array<Coordinate>) {
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

function selectPiece(gameState: GameState, coordinate: Coordinate): GameState {
    const selectedPiece = gameState.getPiece(coordinate)

    if (!selectedPiece) {
        return { ...gameState, selectedPiece: undefined }
    }
    console.log("Selecting piece")

    const filteredCheckMoves = filterPieceMovesThatPutKingInCheck(gameState.board, coordinate, selectedPiece.piece.moves(gameState.board.board, coordinate))

    const pieceMoves = filterMovesOntopOfSameColor(gameState.board, filteredCheckMoves, selectedPiece.color)

    if (selectedPiece.piece.name === PieceName.King) {
        if (gameState.board.canCastleQueenSide(selectedPiece.color)) {
            pieceMoves.push({ row: selectedPiece.startingCoordinate.row, column: 3 })
        }

        if (gameState.board.canCastleKingSide(selectedPiece.color)) {
            console.log("Can castle king side")
            pieceMoves.push({ row: selectedPiece.startingCoordinate.row, column: 7 })
        }
    }

    if (gameState?.selectedPiece?.piece.id === gameState.getPiece(coordinate)?.id) {
        console.log("Piece already selected")
        return { ...gameState, selectedPiece: undefined }
    }
    const board: BoardArray<boolean> = emptyBoard()

    pieceMoves.forEach((move: Coordinate) => {
        board[move.row - 1][move.column - 1] = true
    })

    return { ...gameState, selectedPiece: { coordinates: coordinate, piece: selectedPiece, moves: board } }
}

