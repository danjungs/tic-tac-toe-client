import React, { useEffect, useState } from 'react'
import './game-room.scss';
import { GAME_CONFIG } from './game-room.constants';

export default function GameRoom({ username, room, socket }) {
  const [gameOverText, setGameOverText] = useState('')
  const [myTurn, setMyTurn] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [board, setBoard] = useState(GAME_CONFIG.initBoardState);
  const [gameState, setGameState] = useState(GAME_CONFIG.initGameState)


  const makeMove = (row,col) => {
    if(!gameState.ongoing || board[row][col] !== '' || !myTurn) {
      console.log('disabilitaod')
      return;
    }
    socket.emit('make_move', {room, symbol, position: {row, col}})
  }

  useEffect(() => {
    const startGame = (data) => {
      setBoard(GAME_CONFIG.initBoardState)
      const state = JSON.parse(JSON.stringify(gameState))
      state.ongoing = true;
      setGameState(state);
      const player = data.find(el => el.username === username)
      setSymbol(player.symbol);
      setMyTurn(player.symbol === 'X');
    }
    const updateGame = (data) => {
      const { position } = data;
      const turnBoard = JSON.parse(JSON.stringify(board));
      turnBoard[position.row][position.col] = data.symbol;
      setBoard(turnBoard);
      if(isGameOver(turnBoard)) {
        setGameOver(turnBoard);
        
        return;
      }
      updateTurn(data);
    }
    const updateTurn = (data) => {
      const turn = symbol !== data.symbol;
      setMyTurn(turn)
    }
    const isGameOver = (turnBoard) => {
      console.log(turnBoard)
      if (GAME_CONFIG.checkWinner(turnBoard)) {
        return true;
      };
      const draw = !(turnBoard.some(row => row.some(el => el === '')));
      return draw;
    }
    const setGameOver = (turnBoard) => {
      const state = JSON.parse(JSON.stringify(gameState))
      state.ongoing = false;
      setGameState(state);
      const winner = GAME_CONFIG.checkWinner(turnBoard);
      if (winner) {
        setGameOverText(winner[0] === symbol ? 'Você Ganhou :)' : 'Você Perdeu :(')
        return;
      }
      setGameOverText('Deu velha :|')
    } 

    socket.on('begin_game', data => {
      startGame(data);
      console.log('Begin game')
    });
    socket.on('move_made', data => {
      updateGame(data)
    })
    return () => {
      socket.off('begin_game');
      socket.off('move_made');
    }
  }, [socket, board, symbol, username, gameOverText, gameState, myTurn]);
  
  return ( 
    <div className = 'game-room-container'>
      <div className = 'game-room-header'>
        <span hidden={!gameState.ongoing}>MEU SIMBOLO É: {symbol}</span>
        <span hidden={!gameState.ongoing}>MEU TURNO É {myTurn ? 'true': 'false'}</span>
        <span>{gameOverText}</span>
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
                    onClick={() => makeMove(row_i,col)}
                    disabled={!gameState.ongoing}  
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
      </div>
    </div>
  )
}