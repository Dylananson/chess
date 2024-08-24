import { Board, compareCoordinates, Coordinate, coordToKey, getBoardCell, isOnBoard } from "../Game";
import { ActivePiece, Color, createActivePiece, Piece } from "./ActivePiece";
import { PieceName } from "./PieceName";
import blackRookSvg from '../assets/Chess_rdt45.svg'
import whiteRookSvg from '../assets/Chess_rlt45.svg'


export const createRook = (color: Color, coordinate: Coordinate):ActivePiece => {
    return createActivePiece({
        piece: Rook,
        color: color,
        id: coordToKey(coordinate),
        startingCoordinate: coordinate,
        hasMoved: false,
    })
}


export function RookDisplay(color: Color) {
    return color === Color.Black ? <img src={blackRookSvg} /> : <img src={whiteRookSvg} />
}

export function oppositeColor(color: Color) {
    return color === Color.Black ? Color.White : Color.Black
}

export function RookMoves(board: Board<ActivePiece>, coordinates: Coordinate): Array<Coordinate> {
    const out: Array<Coordinate> = []

    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ]

    const pieceColor = getBoardCell(board, coordinates)?.color

    if (pieceColor === undefined) {
        throw new Error('No piece found on the board')
    }

    dirs.forEach(d => {
        let newCoord = { row: coordinates.row + d[0], column: coordinates.column + d[1] }

        while (isOnBoard(newCoord)) {
            if (getBoardCell(board, newCoord)?.color === pieceColor) {
                //there is a piece blocking the path
                break
            }

            if (getBoardCell(board, newCoord)?.color === oppositeColor(pieceColor)) {
                //there is a piece blocking the path
                out.push({ row: newCoord.row, column: newCoord.column })
                break
            }

            if (!compareCoordinates(newCoord, coordinates)) {
                out.push(newCoord)
            }
            newCoord = { row: newCoord.row + d[0], column: newCoord.column + d[1] }
        }
    })

    return out
}

export const Rook: Piece = {
    name: PieceName.Rook,
    draw: RookDisplay,
    value: -1,
    moves: RookMoves
};

