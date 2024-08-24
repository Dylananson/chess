import { Coordinate } from './Coordinate'
import { ActivePiece, Color } from './pieces/ActivePiece'
import { PieceName } from './pieces/PieceName'

export type Board<T> = Array<Array<undefined | T>>

export const emptyRow = (): Row<undefined> => {
    return Array.from(Array(8))
}
export const emptyBoard = (): Board<undefined> => {
    return Array.from(Array(8)).map(emptyRow);
}

type Row<T> = Array<T>

const printBoard = (board: any) => {
    const s = board.map((row: any) => row.map((cell: any) => cell?.piece?.name || '_').join('|').concat('|')).reverse().join('\n')
    console.log()
    console.log(s)
    console.log()
}

export const isOnBoard = (coordinate: Coordinate) => {
    return (coordinate.row <= 8 && coordinate.row >= 1 && coordinate.column >= 1 && coordinate.column <= 8)
}



export function deepCopyBoard<T>(board: Board<T>): Board<T> {
    return board.map(arr => arr.slice())
}

export enum ColumnValues {
    A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8
}

export function getBoardCell(board: Board<ActivePiece>, coord: Coordinate) {
    return board[coord.row - 1][coord.column - 1]
}


export const createBoard = (pieces: Array<ActivePiece>) => {
    const board: Board<ActivePiece> = emptyBoard()
    pieces.forEach(piece => {
        board[piece.startingCoordinate.row - 1][piece.startingCoordinate.column - 1] = piece
    })
    return board
}


export const coordToKey = (coord: Coordinate) => `${coord.row}${coord.column}`

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

