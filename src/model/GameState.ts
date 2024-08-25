import { emptyBoard, filterMovesOntopOfSameColor, getBoardCell, BoardArray, Board, Coordinate, compareCoordinates } from "./Board"
import { ActivePiece, Color } from "./pieces/ActivePiece"
import { UnfilteredPawnMoves as unfilteredPawnMoves } from "./pieces/Pawn"
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
    captureEnpassant: (oldCoordinates: Coordinate, newCoordinates: Coordinate) => GameState
    with: (newBoard: Board) => GameState
    enpassant?: Coordinate
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
        enpassant: undefined,
        captureEnpassant(oldCoordinates: Coordinate, newCoordinates: Coordinate) {
            return this.with(this.board.captureEnpassant(oldCoordinates, newCoordinates))
        },
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
            if (!oldCoordinates) {
                return this
            }
            const piece = this.getPiece(oldCoordinates)
            if (!piece) {
                console.log("Cannot move piece if no piece is selected");
                return this
            }

            if (piece.color !== this.playerTurn) {
                console.log("Cannot move piece on other players turn")
                return this
            }

            if (isCastleKingSide(this.board.board, oldCoordinates, newCoordinates) && this.board.canCastleKingSide(piece.color)) {
                return this.castleKingSide(piece.color)
            }

            if (isCastleQueenSide(this.board.board, oldCoordinates, newCoordinates) && this.board.canCastleQueenSide(piece.color)) {
                return this.castleQueenSide(piece.color)
            }

            console.log("Moving piece")

            if (piece.piece.name === PieceName.Pawn && this.enpassant !== undefined) {
                console.log("Checking if enpassant is valid")
                const valid = unfilteredPawnMoves(this.board.board, oldCoordinates).some(move => compareCoordinates(move, this.enpassant!))
                if (valid) {
                    console.log("Enpassant is valid")
                    return this.captureEnpassant(oldCoordinates, newCoordinates)
                }
            }

            console.log("Checking if move is legal")


            const canMove = this.board.isLegalMove(oldCoordinates, newCoordinates)

            if (!canMove) {
                console.log("Cannot move piece")
                return this
            }

            return {
                ...this.with(this.board.move(oldCoordinates, newCoordinates)),
                enpassant: checkEnpassant(piece, oldCoordinates, newCoordinates)
            }
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

export function checkEnpassant(piece: ActivePiece, oldCoordinates: Coordinate, newCoordinates: Coordinate): Coordinate | undefined {
    if (piece?.piece.name === PieceName.Pawn) {
        if (Math.abs(oldCoordinates.row - newCoordinates.row) === 2) {
            //then moved twice
            return { row: (oldCoordinates.row + newCoordinates.row) / 2, column: oldCoordinates.column }
        }
    }
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

