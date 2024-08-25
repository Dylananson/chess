import { coordToKey, BoardArray, getBoardCell, isOnBoard } from "../Board";
import { Coordinate } from "../../Coordinate";
import { ActivePiece, Color, createActivePiece, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackBishopSvg from '@assets/Chess_bdt45.svg'
import whiteBishopSvg from '@assets/Chess_blt45.svg'
import { oppositeColor } from "./Rook";

export const createBishop = (color: Color, startingCoordinates: Coordinate): ActivePiece => {
    return createActivePiece({
        piece: Bishop,
        color: color,
        id: coordToKey(startingCoordinates),
        startingCoordinate: startingCoordinates,
        hasMoved: false,
    })
}


export const Bishop: Piece = {
    name: PieceName.Bishop,
    draw: BishopDisplay,
    value: -1,
    moves: BishopMoves,
};


export function BishopDisplay(color: Color) {
    return color === Color.Black ? <img src={blackBishopSvg} /> : <img src={whiteBishopSvg} />
}


export function BishopMoves(board: BoardArray<ActivePiece>, coordinates: Coordinate) {
    const dirs = [[-1, -1], [1, 1], [-1, 1], [1, -1]]
    let res: Array<Coordinate> = []

    const pieceColor = getBoardCell(board, coordinates)?.color

    if (pieceColor === undefined) {
        throw new Error('No piece found on the board')
    }

    dirs.forEach(([r, c]) => {
        let currentCoordinate = { row: coordinates.row, column: coordinates.column }
        currentCoordinate.row += r
        currentCoordinate.column += c

        while (isOnBoard(currentCoordinate)) {
            if (getBoardCell(board, currentCoordinate)?.color === pieceColor) {
                //there is a piece blocking the path
                break
            }

            if (getBoardCell(board, currentCoordinate)?.color === oppositeColor(pieceColor)) {
                //there is a piece blocking the path
                res.push({ row: currentCoordinate.row, column: currentCoordinate.column })
                break
            }
            res.push({ row: currentCoordinate.row, column: currentCoordinate.column })
            currentCoordinate.row += r
            currentCoordinate.column += c
        }

    })
    return res
}

