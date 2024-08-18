import { Coordinate } from "./Board";
import { PieceName } from "./pieces/PieceName";

export enum Color {
    White,
    Black
}

export type ActivePiece = {
    color: Color;
    piece: Piece;
    startingCoordinate: Coordinate;
    id: string;
};

type MovesFunction = (coorinates: Coordinate) => Array<Coordinate>
type DrawPieceFunction = (color: Color) => React.ReactNode

export type Piece = {
    name: PieceName
    value: number
    moves: MovesFunction
    draw: DrawPieceFunction
}

