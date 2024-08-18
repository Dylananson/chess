import { BishopMoves } from "./Bishop";
import { Color, Coordinate, Piece } from "../Board";
import { PieceName } from "./PieceName";
import { RookMoves } from "./Rook";
import blackQueenSvg from './assets/Chess_qdt45.svg'
import whiteQueenSvg from './assets/Chess_qlt45.svg'


export const Queen: Piece = {
    name: PieceName.Queen,
    draw: QueenDisplay,
    value: -1,
    moves: QueenMoves
};



export function QueenMoves(coordinates: Coordinate): Array<Coordinate> {
    return RookMoves(coordinates).concat(BishopMoves(coordinates))
}

export function QueenDisplay(color: Color): React.ReactNode {
    return color === Color.Black ? <img src={blackQueenSvg} /> : <img src={whiteQueenSvg} />
}
