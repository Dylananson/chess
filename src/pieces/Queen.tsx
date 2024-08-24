import { BishopMoves } from "./Bishop";
import { coordToKey } from "../Board";
import { Coordinate } from "../Coordinate";
import { PieceName } from "./PieceName";
import { RookMoves } from "./Rook";
import blackQueenSvg from '../assets/Chess_qdt45.svg'
import whiteQueenSvg from '../assets/Chess_qlt45.svg'
import { ActivePiece, Color, createActivePiece, Piece } from "./ActivePiece";
import { Board } from "../Board";

export const createQueen = (color: Color, startingCoordinate: Coordinate) :ActivePiece => {
    return createActivePiece({
        piece: Queen,
        color: color,
        id: coordToKey(startingCoordinate),
        startingCoordinate: startingCoordinate,
        hasMoved: false,
    })
}


export const Queen: Piece = {
    name: PieceName.Queen,
    draw: QueenDisplay,
    value: -1,
    moves: QueenMoves
};



export function QueenMoves(board:Board<ActivePiece>, coordinates: Coordinate): Array<Coordinate> {
    return RookMoves(board, coordinates).concat(BishopMoves(board, coordinates))
}

export function QueenDisplay(color: Color): React.ReactNode {
    return color === Color.Black ? <img src={blackQueenSvg} /> : <img src={whiteQueenSvg} />
}
