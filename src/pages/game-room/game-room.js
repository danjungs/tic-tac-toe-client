import React, { useEffect, useState } from 'react'
import './game-room.scss';
import { GAME_CONFIG } from './game-room.constants';

const player_1 = GAME_CONFIG.player_1;
const player_2 = GAME_CONFIG.player_2

export default function GameRoom() {
  const [board, setBoard] = useState(GAME_CONFIG.initBoardState);
  // const [gameOver, setGameOver] = useState(false);
  // const [gameStart, setGameStart] = useState(false);
  const [gameState, setGameState] = useState(GAME_CONFIG.initGameState)
  const updateGame = (row,col) => {
    if((gameState.gameOver || !gameState.gameStart) || board[row][col] != '') {
      return;
    }
    const turnBoard = JSON.parse(JSON.stringify(board));
    const updateSymbol = player_1.turn ? player_1.symbol : player_2.symbol;
    turnBoard[row][col] = updateSymbol;
    setBoard(turnBoard);
    updateTurn();
  }
  const updateTurn = () => {
    player_1.turn = !player_1.turn
    player_2.turn = !player_2.turn
  }

  const startGame = () => {
    setBoard(GAME_CONFIG.initBoardState)
    const state = JSON.parse(JSON.stringify(GAME_CONFIG.initGameState));
    player_1.turn = true;
    player_2.turn = false;
    state.gameStart = true;
    setGameState(state)
    // setGameStart(true);
    // setGameOver(false)
  }

  const setGameOver = () => {
    const state = JSON.parse(JSON.stringify(gameState))
    state.gameOver = true;
    const win = GAME_CONFIG.checkWin(board);
    if (win) {
      state.winner = win === 'XXX' ? 'player_1' : 'player_2'
    }
    setGameState(state);
  }

  useEffect(() => {
    const isGameOver = () => {
      // const gameOverPositions = GAME_CONFIG.setGameoverPositions(board);
      // const gameOver = gameOverPositions.some(el => el === 'XXX' || el === 'OOO');
      if (GAME_CONFIG.checkWin(board)) {
        return true;
      };
      const draw = !(board.some(row => row.some(el => el === '')));
      return draw;
    }
    if(isGameOver()) {
      setGameOver(true);
    }
  }, [board])
  

  return ( 
    <div className = 'game-room-container'>
      <div className = 'game-room-header'>
        <span className='game-room-turn' hidden={!gameState.gameStart || gameState.gameOver}> É a vez de: {player_1.turn ? 'player_1' : 'player_2'}</span>
        <span className='game-room-game-over' hidden={!gameState.gameOver}>GAME OVER</span>
        <span hidden={!gameState.winner}>Vencedor: {gameState.winner}</span>
      </div>
      <div className = 'game-room-board-container'>
        {
          GAME_CONFIG.rowsLabel.map((row, row_i) => {
            return(
              GAME_CONFIG.colLabel.map(col => {
                return (
                  <div 
                    id = { row + col }
                    className ='game-room-board-cel'
                    key = { row + col } 
                    onClick={() => updateGame(row_i,col)}
                    disabled={gameState.gameOver || !gameState.gameStart}  
                  >
                    <span className='game-room-symbols'>{ board[row_i][col] }</span>
                  </div>
                )
              })
            )
          })
        } 
      </div>
      <div className='game-room-button-container'>
        <button onClick={startGame}>Começar Jogo</button>
      </div>
    </div>
  )
}