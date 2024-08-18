import { Coordinate } from "../Board";
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

type MovesFunction = (coorinates: Coordinate) => Array<Coordinate>
type MovesFunctionWithHasMoved = (coorinates: Coordinate, hasMoved: boolean) => Array<Coordinate>
type DrawPieceFunction = (color: Color) => React.ReactNode

export type Piece = {
    name: PieceName
    value: number
    moves: MovesFunction  | MovesFunctionWithHasMoved
    draw: DrawPieceFunction
}

