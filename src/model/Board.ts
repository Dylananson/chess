import { filterPieceMovesThatPutKingInCheck } from './GameState'
import { ActivePiece, Color } from './pieces/ActivePiece'
import { createBishop } from './pieces/Bishop';
import { createKnight } from './pieces/Knight';
import { PieceName } from './pieces/PieceName'
import { createQueen } from './pieces/Queen';
import { createRook } from './pieces/Rook';

export type BoardArray<T> = Array<Array<undefined | T>>
export type Coordinate = { row: number; column: number };

export function compareCoordinates(coord1: Coordinate, coord2: Coordinate) {
    return coord1.row === coord2.row && coord1.column === coord2.column
}

export const emptyRow = (): Row<undefined> => {
    return Array.from(Array(8))
}
export const emptyBoard = (): BoardArray<undefined> => {
    return Array.from(Array(8)).map(emptyRow);
}

type Row<T> = Array<T>

export type Board = {
    board: BoardArray<ActivePiece>
    move: (oldCoordinates: Coordinate, newCoordinates: Coordinate) => Board
    copy: () => Board
    copyBoard: () => BoardArray<ActivePiece>
    getPiece: (coordinates: Coordinate) => ActivePiece | undefined
    isCheck: (color: Color) => boolean
    isCheckMate: (color: Color) => boolean
    isStalemate: (color: Color) => boolean
    canCastleKingSide: (color: Color) => boolean
    canCastleQueenSide: (color: Color) => boolean
    castleKingSide: (color: Color) => Board
    castleQueenSide: (color: Color) => Board
    getLegalMoves: (color: Color) => Array<Coordinate>
    isLegalMove: (oldCoordinates: Coordinate, newCoordinates: Coordinate) => boolean
    isPieceInWay: (startingCoordinate: Coordinate, endCoordinate: Coordinate) => boolean,
    hasLegalMove: (color: Color) => boolean
    promotePawn: (coordinates: Coordinate, newPiece: PieceName) => Board
    findKing: (color: Color) => Coordinate | undefined
}

export function createBoard(board: BoardArray<ActivePiece>): Board {
    return {
        board: board,
        findKing(color: Color) {
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
        },
        promotePawn(coordinates: Coordinate, pieceName: PieceName) {
            //assumes pawn is in promotion square
            const newBoard = deepCopyBoard(this.board)

            const pawn = this.getPiece(coordinates)

            if (pawn?.piece.name !== PieceName.Pawn) {
                return this
            }

            if (pawn.color === Color.White && coordinates.row !== 8) {
                return this
            }

            if (pawn.color === Color.Black && coordinates.row !== 1) {
                return this
            }

            let newPiece;

            switch (pieceName) {
                case PieceName.Queen:
                    newPiece = { ...createQueen(pawn.color, coordinates), hasMoved: true }
                    break;
                case PieceName.Rook:
                    newPiece = { ...createRook(pawn.color, coordinates), hasMoved: true }
                    break;
                case PieceName.Bishop:
                    newPiece = { ...createBishop(pawn.color, coordinates), hasMoved: true }
                    break;
                case PieceName.Knight:
                    newPiece = { ...createKnight(pawn.color, coordinates), hasMoved: true }
                    break;
                default:
                    console.error("Invalid piece")
                    return this
            }

            newBoard[coordinates.row - 1][coordinates.column - 1] = newPiece

            return createBoard(newBoard)
        },
        copy: () => createBoard(deepCopyBoard(board)),
        copyBoard: () => deepCopyBoard(board),
        move(oldCoordinates: Coordinate, newCoordinates: Coordinate) {
            const piece = this.getPiece(oldCoordinates)
            const newBoard = this.copyBoard()

            newBoard[oldCoordinates?.row - 1][oldCoordinates.column - 1] = undefined
            newBoard[newCoordinates.row - 1][newCoordinates.column - 1] = piece?.move()
            return createBoard(newBoard)
        },
        getPiece(coord: Coordinate) {
            return this.board[coord.row - 1][coord.column - 1]
        },
        isCheck(color: Color) {
            return isCheck(this, color)
        },
        isCheckMate(color: Color) {
            return isCheckMate(this, color)
        },
        isStalemate(color: Color) {
            return isStalemate(this, color)
        },
        canCastleKingSide(color: Color) {
            return canCastleKingSide(this, color)
        },
        canCastleQueenSide(color: Color) {
            return canCastleQueenSide(this, color)
        },
        castleKingSide(color: Color) {
            return castleKingSide(this, color)
        },
        castleQueenSide(color: Color) {
            return castleQueenSide(this, color)
        },
        getLegalMoves(color: Color) {
            return getLegalMoves(this, color)
        },
        isLegalMove(oldCoordinates: Coordinate, newCoordinates: Coordinate) {
            return isLegalMove(this, oldCoordinates, newCoordinates)
        },
        isPieceInWay(startingCoordinate: Coordinate, endCoordinate: Coordinate) {
            return isPieceInWay(startingCoordinate, endCoordinate, this.board)
        },
        hasLegalMove(color: Color) {
            return hasLegalMove(this, color)
        }
    }
}

export const printBoard = (board: BoardArray<ActivePiece>) => {
    const s = board.map((row: any) => row.map((cell: any) => cell?.piece?.name || '_').join('|').concat('|')).reverse().join('\n')
    console.log()
    console.log(s)
    console.log()
}

export const isOnBoard = (coordinate: Coordinate) => {
    return (coordinate.row <= 8 && coordinate.row >= 1 && coordinate.column >= 1 && coordinate.column <= 8)
}


function deepCopyBoard<T>(board: BoardArray<T>): BoardArray<T> {
    return board.map(arr => arr.slice())
}

export enum ColumnValues {
    A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8
}

export function getBoardCell(board: BoardArray<ActivePiece>, coord: Coordinate) {
    return board[coord.row - 1][coord.column - 1]
}

export const createBoardWithPieces = (pieces: Array<ActivePiece>): Board => {
    const board: BoardArray<ActivePiece> = emptyBoard()
    pieces.forEach(piece => {
        board[piece.startingCoordinate.row - 1][piece.startingCoordinate.column - 1] = piece
    })

    return createBoard(board)
}


export const coordToKey = (coord: Coordinate) => `${coord.row}${coord.column}`

export function isAttacked(board: BoardArray<ActivePiece>, color: Color, coordinate: Coordinate) {
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

export function isCheck(board: Board, color: Color) {
    const kingCoordinate = board.findKing(color)

    if (!kingCoordinate) {
        console.error("King not found")
        return false
    }

    return isAttacked(board.board, color, kingCoordinate)
}


export function filterMovesOntopOfSameColor(board: Board, moves: Array<Coordinate>, color: Color) {
    return moves.filter(move => {
        const piece = board.getPiece(move)

        return !piece || piece.color !== color
    })
}

function hasLegalMove(board: Board, color: Color) {
    return board.getLegalMoves(color).length > 0
}

function getLegalMoves(board: Board, color: Color) {
    const legalMoves: Array<Coordinate> = []

    for (let row = 1; row <= board.board.length; row++) {
        for (let column = 1; column <= board.board.length; column++) {
            const piece = board.getPiece({ row, column })
            if (piece?.color === color) {
                const moves = piece?.piece.moves(board.board, { row, column })
                if (moves) {
                    const nonCheckedMoves = filterPieceMovesThatPutKingInCheck(board, { row, column }, moves)
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


function isCheckMate(board: Board, color: Color) {
    return board.isCheck(color) && !board.hasLegalMove(color);
}

function isStalemate(board: Board, color: Color) {
    return !board.isCheck(color) && !board.hasLegalMove(color);
}

function isLegalMove(board: Board, oldCoordinates: Coordinate, newCoordinates: Coordinate): boolean {
    const piece = board.getPiece(oldCoordinates)

    if (!piece) {
        console.error("Piece not found")
        return false
    }

    const validMove = piece.piece.moves(board.board, oldCoordinates)
        .some(move => compareCoordinates(move, newCoordinates))

    if (!validMove) {
        console.error("Invalid move")
        return false
    }

    if (board.getPiece(newCoordinates)?.color === piece.color) {
        console.log("Cannot move piece on top of piece of the same team")
        return false
    }

    return !board.move(oldCoordinates, newCoordinates).isCheck(piece.color)
}


export function isPieceInWay(startingCoordinate: Coordinate, endCoordinate: Coordinate, board: BoardArray<ActivePiece>): boolean {
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

const canCastleQueenSide = (board: Board, color: Color) => {
    if (board.isCheck(color)) {
        return false
    }
    const kingCoordinates = board.findKing(color)

    if (!kingCoordinates) {
        return false
    }

    const king = board.getPiece(kingCoordinates)

    if (!king) {
        return false
    }

    const rook = board.getPiece({ row: king.startingCoordinate.row, column: 1 })

    if (!rook) {
        return false
    }

    if (king.hasMoved || rook.hasMoved) {
        return false
    }

    for (let i = king.startingCoordinate.column - 1; i > rook.startingCoordinate.column; i--) {
        if (board.getPiece({ row: king.startingCoordinate.row, column: i })) {
            return false
        }
        if (isAttacked(board.board, king.color, { row: king.startingCoordinate.row, column: i })) {
            return false
        }
    }

    return true
}


const canCastleKingSide = (board: Board, color: Color) => {
    if (board.isCheck(color)) {
        return false
    }
    const kingCoordinates = board.findKing(color)

    if (!kingCoordinates) {
        return false
    }

    const king = board.getPiece(kingCoordinates)

    if (!king) {
        return false
    }

    const rook = board.getPiece({ row: king.startingCoordinate.row, column: 8 })

    if (!rook) {
        return false
    }

    if (king.hasMoved || rook.hasMoved) {
        return false
    }

    for (let i = king.startingCoordinate.column + 1; i < rook.startingCoordinate.column; i++) {
        if (board.getPiece({ row: king.startingCoordinate.row, column: i })) {
            return false
        }
        if (isAttacked(board.board, king.color, { row: king.startingCoordinate.row, column: i })) {
            return false
        }
    }

    return true
}


const castleQueenSide = (board: Board, color: Color) => {
    const kingCoordinates = board.findKing(color)

    if (!kingCoordinates) {
        return board
    }

    const rook = board.getPiece({ row: kingCoordinates.row, column: 1 })

    if (!rook) {
        return board
    }

    if (!board.canCastleQueenSide(color)) {
        return board
    }

    return board
        .move(kingCoordinates, { row: kingCoordinates.row, column: 3 })
        .move({ row: kingCoordinates.row, column: 1 }, { row: kingCoordinates.row, column: 4 })
}


const castleKingSide = (board: Board, color: Color) => {
    const kingCoordinates = board.findKing(color)

    if (!kingCoordinates) {
        return board
    }

    const rook = board.getPiece({ row: kingCoordinates.row, column: 8 })

    if (!rook) {
        return board
    }

    if (!board.canCastleKingSide(color)) {
        return board
    }

    return board
        .move(kingCoordinates, { row: kingCoordinates.row, column: 7 })
        .move({ row: kingCoordinates.row, column: 8 }, { row: kingCoordinates.row, column: 6 })
}

