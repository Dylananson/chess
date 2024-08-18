import { Coordinate } from "../Board";
import { Color, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackPawnSvg from './assets/Chess_pdt45.svg'
import whitePawnSvg from './assets/Chess_plt45.svg'

export function FakeMoves(coordinates: Coordinate) {
    return []
}


const Pawn: Piece = {
    name: PieceName.Pawn,
    draw: PawnDisplay,
    value: -1,
    moves: FakeMoves
};


export function PawnDisplay(color: Color) {
    return color === Color.Black ? <img src={blackPawnSvg} /> : <img src={whitePawnSvg} />
}
