import { Game } from "../Game"
import { Board, BoardArray, createBoardWithPieces, emptyBoard } from "../model/Board"
import { ActivePiece, Color } from "../model/pieces/ActivePiece"
import { createBishop } from "../model/pieces/Bishop"
import { createKing } from "../model/pieces/King"
import { createKnight } from "../model/pieces/Knight"
import { createPawn } from "../model/pieces/Pawn"
import { createQueen } from "../model/pieces/Queen"
import { createRook } from "../model/pieces/Rook"
import { ColumnValues } from "../model/Board"
import { createGameState, GameState } from "../model/GameState"

export const promotingPawnGameState = (): GameState => {
    const pawn = createPawn(Color.White, { row: 7, column: 1 })
    const blackKing = createKing(Color.Black, { row: 8, column: 5 })
    const whiteKing = createKing(Color.White, { row: 1, column: 5 })

    const b = createBoardWithPieces([pawn, blackKing, whiteKing])

    return createGameState(b, undefined, Color.White)
}

export const PromotingPawnGame = () => {

    return (
        <div>
            <Game initGameState={promotingPawnGameState()} />
        </div>
    )
}


export const CastleKingSideGame = () => {
    //const initGame = initGameState()
    //
    const blackKing = createKing(Color.Black, { row: 8, column: 5 })

    const whiteKing = createKing(Color.White, { row: 1, column: 5 })
    const rook = createRook(Color.White, { row: 1, column: 8 })
    const lRook = createRook(Color.White, { row: 1, column: 1 })
    const board = createBoardWithPieces(
        [whiteKing, rook, blackKing, lRook]
    )

    const game = createGameState(board, undefined, Color.White)

    return (
        <div>
            <Game initGameState={game} />
        </div>
    )
}


export const defaultGame = (): GameState => {
    const BlackKing: ActivePiece = createKing(Color.Black, { row: 8, column: ColumnValues.E })
    const WhiteKing = createKing(Color.White, { row: 1, column: ColumnValues.E })
    const WhiteQueen = createQueen(Color.White, { row: 1, column: ColumnValues.D })
    const BlackQueen = createQueen(Color.Black, { row: 8, column: ColumnValues.D })
    const WhiteARook = createRook(Color.White, { row: 1, column: ColumnValues.A })
    const WhiteHRook = createRook(Color.White, { row: 1, column: ColumnValues.H })
    const BlackARook = createRook(Color.Black, { row: 8, column: ColumnValues.A })
    const BlackHRook = createRook(Color.Black, { row: 8, column: ColumnValues.H })
    const WhiteCBishop = createBishop(Color.White, { row: 1, column: ColumnValues.C })
    const WhiteFBishop = createBishop(Color.White, { row: 1, column: ColumnValues.F })
    const BlackCBishop = createBishop(Color.Black, { row: 8, column: ColumnValues.C })
    const BlackFBishop = createBishop(Color.Black, { row: 8, column: ColumnValues.F })
    const WhiteBKnight = createKnight(Color.White, { row: 1, column: ColumnValues.B })
    const WhiteGKnight = createKnight(Color.White, { row: 1, column: ColumnValues.G })
    const BlackBKnight = createKnight(Color.Black, { row: 8, column: ColumnValues.B })
    const BlackGKnight = createKnight(Color.Black, { row: 8, column: ColumnValues.G })
    const WhitePawns: Array<ActivePiece> = Array.from(Array(8)).map((_, i) => { return createPawn(Color.White, { row: 2, column: i + 1 }) })
    const BlackPawns: Array<ActivePiece> = Array.from(Array(8)).map((_, i) => { return createPawn(Color.Black, { row: 7, column: i + 1 }) })


    const WhitePieces = [
        WhiteKing,
        WhiteQueen,
        WhiteCBishop,
        WhiteFBishop,
        WhiteHRook,
        WhiteARook,
        WhiteBKnight,
        WhiteGKnight
    ].concat(WhitePawns)

    const BlackPieces = [
        BlackKing,
        BlackQueen,
        BlackCBishop,
        BlackFBishop,
        BlackHRook,
        BlackARook,
        BlackBKnight,
        BlackGKnight
    ].concat(BlackPawns)

    const AllPieces = BlackPieces.concat(WhitePieces)

    return createGameState(createBoardWithPieces(AllPieces), undefined, Color.White)
}
