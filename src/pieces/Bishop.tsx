import { Coordinate, isOnBoard } from "../Game";
import { Color, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackBishopSvg from '../assets/Chess_bdt45.svg'
import whiteBishopSvg from '../assets/Chess_blt45.svg'


export const Bishop: Piece = {
    name: PieceName.Bishop,
    draw: BishopDisplay,
    value: -1,
    moves: BishopMoves
};


export function BishopDisplay(color: Color) {
    return color === Color.Black ? <img src={blackBishopSvg} /> : <img src={whiteBishopSvg} />
}


export function BishopMoves(coordinates: Coordinate) {
    const dirs = [[-1, -1], [1, 1], [-1, 1], [1, -1]]
    let res: Array<Coordinate> = []
    dirs.forEach(([r, c]) => {
        let currentCoordinate = { row: coordinates.row, column: coordinates.column }
        currentCoordinate.row += r
        currentCoordinate.column += c

        while (isOnBoard(currentCoordinate)) {
            res.push({ row: currentCoordinate.row, column: currentCoordinate.column })
            currentCoordinate.row += r
            currentCoordinate.column += c
        }

    })
    return res
}

