import { Coordinate } from './Coordinate'
import { ActivePiece } from './pieces/ActivePiece'

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

