import { Board, BoardArray, Coordinate, compareCoordinates, emptyBoard, filterMovesOntopOfSameColor, getBoardCell } from "./Board"
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

enum SpecialMove {
    CastleKingSide = "CastleKingSide",
    CastleQueenSide = "CastleQueenSide",
    Enpassant = "Enpassant",
    Promotion = "Promotion"
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
        selectPiece(coordinate: Coordinate) {
            const selectedPiece = this.getPiece(coordinate)

            if (!selectedPiece) {
                return { ...this, selectedPiece: undefined }
            }

            if (this?.selectedPiece?.piece.id === this.getPiece(coordinate)?.id) {
                console.log("Piece already selected")
                return { ...this, selectedPiece: undefined }
            }

            console.log("Selecting piece")

            const filteredCheckMoves = filterPieceMovesThatPutKingInCheck(this.board, coordinate, selectedPiece.piece.moves(this.board.board, coordinate))

            const pieceMoves = filterMovesOntopOfSameColor(this.board, filteredCheckMoves, selectedPiece.color)

            const specialMoves = getSpecialMoves(this, coordinate, selectedPiece)

            specialMoves.forEach(move => {
                pieceMoves.push(move)
            })

            const board: BoardArray<boolean> = emptyBoard()

            pieceMoves.forEach((move: Coordinate) => {
                board[move.row - 1][move.column - 1] = true
            })

            return { ...this, selectedPiece: { coordinates: coordinate, piece: selectedPiece, moves: board } }
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

            const specialMove = getSpecialMove(this, oldCoordinates, newCoordinates, piece)

            if (specialMove) {
                return handleSpecialMove(this, specialMove, oldCoordinates, newCoordinates)
            }

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

function canSpecialMove(gameState: GameState, coordinates: Coordinate, piece: ActivePiece): Array<SpecialMove> {
    const out = []
    if (gameState.board.canCastleKingSide(piece.color)) {
        out.push(SpecialMove.CastleKingSide)
    }

    if (gameState.board.canCastleQueenSide(piece.color)) {
        out.push(SpecialMove.CastleQueenSide)
    }

    if (piece.piece.name === PieceName.Pawn && gameState.enpassant !== undefined) {
        const valid = unfilteredPawnMoves(gameState.board.board, coordinates).some(move => compareCoordinates(move, gameState.enpassant!))
        if (valid) {
            out.push(SpecialMove.Enpassant)
        }
    }

    return out
}

function getSpecialMoves(gameState: GameState, coordinates: Coordinate, piece: ActivePiece): Array<Coordinate> {
    const specialMove = canSpecialMove(gameState, coordinates, piece)
    const out = []
    if (specialMove.some(m => m === SpecialMove.CastleKingSide)) {
        out.push({ row: coordinates.row, column: 7 })
    }

    if (specialMove.some(m => m === SpecialMove.CastleQueenSide)) {
        out.push({ row: coordinates.row, column: 3 })
    }

    if (specialMove.some(m => m === SpecialMove.Enpassant)) {
        out.push(gameState.enpassant!)
    }

    return out
}


function getSpecialMove(gameState: GameState, oldCoordinates: Coordinate, newCoordinates: Coordinate, piece: ActivePiece): SpecialMove | undefined {
    const specialMove = canSpecialMove(gameState, oldCoordinates, piece)
    if (isCastleKingSide(gameState.board.board, oldCoordinates, newCoordinates) && specialMove.some(m => m === SpecialMove.CastleKingSide)) {
        return SpecialMove.CastleKingSide
    }

    if (isCastleQueenSide(gameState.board.board, oldCoordinates, newCoordinates) && specialMove.some(m => m === SpecialMove.CastleQueenSide)) {
        return SpecialMove.CastleQueenSide
    }

    if (specialMove.some(m => m === SpecialMove.Enpassant)) {
        const valid = unfilteredPawnMoves(gameState.board.board, oldCoordinates).some(move => compareCoordinates(move, gameState.enpassant!))
        if (valid) {
            return SpecialMove.Enpassant
        }
    }

    return undefined
}

function handleSpecialMove(gameState: GameState, specialMove: SpecialMove | undefined, oldCoordinates: Coordinate, newCoordinates: Coordinate): GameState {
    switch (specialMove) {
        case SpecialMove.CastleKingSide:
            return gameState.castleKingSide(gameState.playerTurn)
        case SpecialMove.CastleQueenSide:
            return gameState.castleQueenSide(gameState.playerTurn)
        case SpecialMove.Enpassant:
            return gameState.captureEnpassant(oldCoordinates, newCoordinates)
        default:
            return gameState
    }
}

