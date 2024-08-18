import { compareCoordinates, Coordinate, isOnBoard } from "../Game";
import { Color, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackRookSvg from '../assets/Chess_rdt45.svg'
import whiteRookSvg from '../assets/Chess_rlt45.svg'


export function RookDisplay(color: Color) {
    return color === Color.Black ? <img src={blackRookSvg} /> : <img src={whiteRookSvg} />
}

export function RookMoves(coordinates: Coordinate): Array<Coordinate> {
    const out: Array<Coordinate> = []

    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ]

    dirs.forEach(d => {
        let newCoord = { row: coordinates.row + d[0], column: coordinates.column + d[1] }

        while (isOnBoard(newCoord)) {
            if (!compareCoordinates(newCoord, coordinates)) {
                out.push(newCoord)
            }
            newCoord = { row: newCoord.row + d[0], column: newCoord.column + d[1] }
        }
    })

    return out
}

export const Rook: Piece = {
    name: PieceName.Rook,
    draw: RookDisplay,
    value: -1,
    moves: RookMoves
};

