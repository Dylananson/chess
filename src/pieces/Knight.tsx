import { Coordinate, isOnBoard } from "../Board";
import { Color, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackKnightSvg from '../assets/Chess_ndt45.svg'
import whiteKnightSvg from '../assets/Chess_nlt45.svg'

export const Knight: Piece = {
    name: PieceName.Knight,
    draw: KnightDisplay,
    value: -1,
    moves: KnightMoves
};


export function KnightMoves(coordinates: Coordinate): Array<Coordinate> {
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
