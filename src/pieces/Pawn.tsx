import { Coordinate } from "../Game";
import { ActivePiece, Color, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackPawnSvg from '../assets/Chess_pdt45.svg'
import whitePawnSvg from '../assets/Chess_plt45.svg'

export function PawnMoves(coordinates: Coordinate, hasMoved: boolean) {
    const out =
        [
            { row: coordinates.row + 1, column: coordinates.column },
            { row: coordinates.row + 1, column: coordinates.column + 1 },
            { row: coordinates.row + 1, column: coordinates.column - 1 },
        ]

    if (!hasMoved) {
        out.push({ row: coordinates.row + 2, column: coordinates.column })
    }

    return out
}

const coordToKey = (coord: Coordinate) => `${coord.row}${coord.column}`

export function createPawn(color: Color, startingCoordinate: Coordinate): ActivePiece {
    return {
        piece: Pawn,
        color: color,
        startingCoordinate: startingCoordinate,
        id: coordToKey(startingCoordinate),
        hasMoved: false
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
