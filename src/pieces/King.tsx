import { Board, Coordinate, coordToKey, isOnBoard } from "../Game";
import { ActivePiece, BaseActivePiece, Color, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackKingSvg from '../assets/Chess_kdt45.svg'
import whiteKingSvg from '../assets/Chess_klt45.svg'

export function KingDisplay(color: Color) {
    return color === Color.Black ? <img src={blackKingSvg} /> : <img src={whiteKingSvg} />
}

export const createKing = (color: Color, startingCoordinate: Coordinate) :ActivePiece => {
    return {
        piece: King,
        color: color,
        id: coordToKey(startingCoordinate),
        startingCoordinate: startingCoordinate,
        hasMoved: false,
        __proto__: BaseActivePiece
    }
}


export function KingMoves(board: Board<ActivePiece>, coordinates: Coordinate) {
    const dirs = [
        [1, 0],   // move right
        [-1, 0],  // move left
        [0, 1],   // move up
        [0, -1],  // move down
        [1, 1],   // move diagonally up-right
        [1, -1],  // move diagonally down-right
        [-1, 1],  // move diagonally up-left
        [-1, -1]  // move diagonally down-left
    ];
    return dirs.map(([r, c]) => {
        const colValue = coordinates.column + c
        return { row: coordinates.row + r, column: colValue }
    }).filter(isOnBoard)
}

export const King: Piece = {
    name: PieceName.King,
    draw: KingDisplay,
    value: -1,
    moves: KingMoves,
};

