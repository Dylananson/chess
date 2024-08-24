import { Game, Board, createBoard, SelectedPiece } from "../Game"
import { ActivePiece, Color } from "../pieces/ActivePiece"
import { createKing } from "../pieces/King"
import { createPawn } from "../pieces/Pawn"
import { createRook } from "../pieces/Rook"

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
