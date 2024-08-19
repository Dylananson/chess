import { Board, compareCoordinates, Coordinate, getBoardCell } from "../Game";
import { ActivePiece, Color, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackPawnSvg from '../assets/Chess_pdt45.svg'
import whitePawnSvg from '../assets/Chess_plt45.svg'
import { oppositeColor } from "./Rook";

export function PawnMoves(board: Board<ActivePiece>, coordinates: Coordinate) {
    const forwardMoves = [
    ]
    const diagonalMoves = []
        // [
        //     { row: coordinates.row + 1, column: coordinates.column + 1 },
        //     { row: coordinates.row + 1, column: coordinates.column - 1 },
        // ]
    //

    const piece = board[coordinates.row - 1][coordinates.column - 1]
    console.log('piece', piece)
    console.log('coordinates', coordinates)

    if (!piece) {
        console.error('Piece not found')
        throw new Error('Piece not found')
    }

    const hasMoved = !compareCoordinates(piece.startingCoordinate, coordinates)

    if (getBoardCell(board, { row: coordinates.row + 1, column: coordinates.column + 1 })?.color === oppositeColor(piece?.color)) {
        diagonalMoves.push({ row: coordinates.row + 1, column: coordinates.column + 1 })
    }


    if (getBoardCell(board, { row: coordinates.row + 1, column: coordinates.column - 1 })?.color === oppositeColor(piece?.color)) {
        diagonalMoves.push({ row: coordinates.row + 1, column: coordinates.column - 1 })
    }

    if(getBoardCell(board, { row: coordinates.row + 1, column: coordinates.column }) === undefined) {
        forwardMoves.push({ row: coordinates.row + 1, column: coordinates.column })
    }

    if (!hasMoved && getBoardCell(board, { row: coordinates.row + 2, column: coordinates.column }) === undefined) {
        forwardMoves.push({ row: coordinates.row + 2, column: coordinates.column })
    }

    return diagonalMoves.concat(forwardMoves)
}

const coordToKey = (coord: Coordinate) => `${coord.row}${coord.column}`

export function createPawn(color: Color, startingCoordinate: Coordinate): ActivePiece {
    return {
        piece: Pawn,
        color: color,
        startingCoordinate: startingCoordinate,
        id: coordToKey(startingCoordinate),
    }
}

export const Pawn: Piece = {
    name: PieceName.Pawn,
    draw: PawnDisplay,
    value: -1,
    moves: PawnMoves,
};


export function PawnDisplay(color: Color) {
    return color === Color.Black ? <img src={blackPawnSvg} /> : <img src={whitePawnSvg} />
}
