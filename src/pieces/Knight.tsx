import { BoardArray, coordToKey, isOnBoard } from "../Board";
import { Coordinate } from "../Coordinate";
import { ActivePiece, Color, createActivePiece, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackKnightSvg from '../assets/Chess_ndt45.svg'
import whiteKnightSvg from '../assets/Chess_nlt45.svg'

export const Knight: Piece = {
    name: PieceName.Knight,
    draw: KnightDisplay,
    value: -1,
    moves: KnightMoves,
};

export const createKnight = (color: Color, startingCoordinate: Coordinate) : ActivePiece => {
    return createActivePiece({
        piece: Knight,
        color: color,
        id: coordToKey(startingCoordinate),
        startingCoordinate: startingCoordinate,
        hasMoved: false,
    })
}


export function KnightMoves(board: BoardArray<ActivePiece>, coordinates: Coordinate): Array<Coordinate> {
    const dirs = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2]
    ]

    const out: Array<Coordinate> = [];

    dirs.forEach(d => {
        const coord = { row: coordinates.row + d[0], column: coordinates.column + d[1] }

        if (isOnBoard(coord)) {
            out.push(coord)
        }
    })

    return out
}

export function KnightDisplay(color: Color) {
    return color === Color.Black ? <img src={blackKnightSvg} /> : <img src={whiteKnightSvg} />
}
