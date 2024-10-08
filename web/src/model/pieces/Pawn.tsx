import { getBoardCell } from "../Board"
import { Coordinate, compareCoordinates, BoardArray, isOnBoard } from "../Board";
import { ActivePiece, Color, createActivePiece, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackPawnSvg from '@assets/Chess_pdt45.svg'
import whitePawnSvg from '@assets/Chess_plt45.svg'
import { oppositeColor } from "./Rook";

export function unfilteredPawnAttackingMoves(board: BoardArray<ActivePiece>, coordinates: Coordinate) {
    const piece = board[coordinates.row - 1][coordinates.column - 1]

    if (!piece) {
        console.error('Piece not found')
        throw new Error('Piece not found')
    }

    const direction = piece.color === Color.White ? 1 : -1

    return [
        {row: coordinates.row + direction, column: coordinates.column + 1},
        {row: coordinates.row + direction, column: coordinates.column - 1},
    ]
}



export function UnfilteredPawnMoves(board: BoardArray<ActivePiece>, coordinates: Coordinate) {
    const piece = board[coordinates.row - 1][coordinates.column - 1]

    if (!piece) {
        console.error('Piece not found')
        throw new Error('Piece not found')
    }

    const direction = piece.color === Color.White ? 1 : -1

    return [
        {row: coordinates.row + direction, column: coordinates.column},
        {row: coordinates.row + direction, column: coordinates.column + 1},
        {row: coordinates.row + direction, column: coordinates.column - 1},
        {row: coordinates.row + (2*direction), column: coordinates.column},
    ]
}


export function PawnMoves(board: BoardArray<ActivePiece>, coordinates: Coordinate) {
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
    return createActivePiece({
        piece: Pawn,
        color: color,
        startingCoordinate: startingCoordinate,
        id: coordToKey(startingCoordinate),
        hasMoved:false,
    })
}

export const Pawn: Piece = {
    name: PieceName.Pawn,
    draw: PawnDisplay,
    value: -1,
    moves: PawnMoves
};


export function PawnDisplay(color: Color) {
    return color === Color.Black ? <img src={blackPawnSvg} /> : <img src={whitePawnSvg} />
}
