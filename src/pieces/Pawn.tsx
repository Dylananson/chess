import { Board, compareCoordinates, Coordinate, getBoardCell, isOnBoard } from "../Game";
import { ActivePiece, Color, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackPawnSvg from '../assets/Chess_pdt45.svg'
import whitePawnSvg from '../assets/Chess_plt45.svg'
import { oppositeColor } from "./Rook";

export function PawnMoves(board: Board<ActivePiece>, coordinates: Coordinate) {
    const forwardMoves = []
    const diagonalMoves = []

    const piece = board[coordinates.row - 1][coordinates.column - 1]

    if (!piece) {
        console.error('Piece not found')
        throw new Error('Piece not found')
    }

    const direction = piece.color === Color.White ? 1 : -1

    const hasMoved = !compareCoordinates(piece.startingCoordinate, coordinates)

    const rightDiagonal = { row: coordinates.row + direction, column: coordinates.column + 1 }

    if (isOnBoard(rightDiagonal) && getBoardCell(board, rightDiagonal)?.color === oppositeColor(piece?.color)) {
        diagonalMoves.push(rightDiagonal)
    }

    const leftDiagonal = { row: coordinates.row + direction, column: coordinates.column - 1 }

    if (isOnBoard(leftDiagonal) && getBoardCell(board, leftDiagonal)?.color === oppositeColor(piece?.color)) {
        diagonalMoves.push(leftDiagonal)
    }

    const forwardMoveOne = { row: coordinates.row + direction, column: coordinates.column }

    if (isOnBoard(forwardMoveOne) && getBoardCell(board, forwardMoveOne) === undefined) {
        forwardMoves.push(forwardMoveOne)
    }

    const moveTwiceCoordinate = { row: coordinates.row + (direction * 2), column: coordinates.column }

    if (isOnBoard(moveTwiceCoordinate) && !hasMoved && getBoardCell(board, { row: coordinates.row + (direction * 2), column: coordinates.column }) === undefined) {
        forwardMoves.push({ row: coordinates.row + (direction * 2), column: coordinates.column })
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
        hasMoved:false,
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
