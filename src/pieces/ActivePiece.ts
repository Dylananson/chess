import { Board, Coordinate } from "../Game";
import { PieceName } from "./PieceName";

export enum Color {
    White,
    Black
}

export type ActivePiece = {
    color: Color;
    piece: Piece;
    startingCoordinate: Coordinate;
    id: string;
    hasMoved: boolean;
};

type MovesFunction = (board: Board<ActivePiece>, coorinates: Coordinate) => Array<Coordinate>
type DrawPieceFunction = (color: Color) => React.ReactNode

export type Piece = {
    name: PieceName
    value: number
    moves: MovesFunction  
    draw: DrawPieceFunction
}

