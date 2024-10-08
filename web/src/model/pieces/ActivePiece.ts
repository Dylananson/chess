import { BoardArray } from "../Board";
import { Coordinate } from "../../Coordinate";
import { PieceName } from "./PieceName";

export enum Color {
    White = "White",
    Black = "Black"
}

export type ActivePiece = {
    color: Color;
    piece: Piece;
    startingCoordinate: Coordinate;
    id: string;
    hasMoved: boolean;
    move: () => ActivePiece
    copy: () => ActivePiece
}  

export function createActivePiece (piece:_ActivePiece) : ActivePiece {
    return {
        ...piece, 
        move () {
            return {...this, hasMoved: true}
        },
        copy () {
            return {...this}
        }
    }
}

export type _ActivePiece = 
{
    color: Color;
    piece: Piece;
    startingCoordinate: Coordinate;
    id: string;
    hasMoved: boolean;
}

type MovesFunction = (board: BoardArray<ActivePiece>, coorinates: Coordinate) => Array<Coordinate>
type DrawPieceFunction = (color: Color) => React.ReactNode

export type Piece = {
    name: PieceName
    value: number
    moves: MovesFunction  
    draw: DrawPieceFunction
}

export const moveActivePiece = (piece:ActivePiece) => {
    return {...piece, hasMoved: true}
}

