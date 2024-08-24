import { Game, Board, createBoard, SelectedPiece, emptyBoard, GameState } from "../Game"
import { ActivePiece, Color } from "../pieces/ActivePiece"
import { createBishop } from "../pieces/Bishop"
import { createKing } from "../pieces/King"
import { createKnight } from "../pieces/Knight"
import { createPawn } from "../pieces/Pawn"
import { createQueen } from "../pieces/Queen"
import { createRook } from "../pieces/Rook"
import { ColumnValues } from "../Game"

export const createGameState = (board: Board<ActivePiece>, selectedPiece: SelectedPiece | undefined, playerTurn: Color, inCheck: boolean, history?: Array<Board<ActivePiece>>): GameState => {
    return {
        board,
        selectedPiece,
        playerTurn,
        inCheck,
        history: history ?? [board],
        historyIndex: 0
    }
}

export const PromotingPawnGame = () => {
    //const initGame = initGameState()
    //
    const pawn = createPawn(Color.White, { row: 7, column: 1 })
    const blackKing = createKing(Color.Black, { row: 8, column: 5 })
    const whiteKing = createKing(Color.White, { row: 1, column: 5 })

    const b = createBoard([pawn, blackKing, whiteKing])

    const game = createGameState(b, undefined, Color.White, false)

    return (
        <div>
            <Game initGameState={game} />
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
    const board = createBoard(
        [whiteKing, rook, blackKing, lRook]
    )

    const game = createGameState(board, undefined, Color.White, false)

    return (
        <div>
            <Game initGameState={game} />
        </div>
    )
}


export const defaultGame = () :GameState=> {
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

    const initBoard = () => {
        const board: Board<ActivePiece> = emptyBoard()
        AllPieces.forEach((piece) => {
            board[piece.startingCoordinate.row - 1][piece.startingCoordinate.column - 1] = piece
        })
        return board
    }


    return {
        get board() {
            return this.history[this.history.length - 1]
        },
        playerTurn: Color.White,
        selectedPiece: undefined,
        inCheck: false,
        history: [initBoard()],
        historyIndex: 0
    }
}
