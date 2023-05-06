
export const GAME_CONFIG = {
  rowsLabel: ['a', 'b', 'c'],
  colLabel: ['0', '1', '2'],
  player_1: {
    symbol: 'X',
    turn: true
  },
  player_2: {
    symbol: 'O',
    turn: false
  },
  initBoardState: [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ],
  initGameState: {
    gameOver: false,
    gameStart: false,
    winner: '',
  },
  setGameoverPositions: (board) => {
    return [
      board[0][0] + board[0][1] + board[0][2],
      board[1][0] + board[1][1] + board[1][2],
      board[2][0] + board[2][1] + board[2][2],
      board[0][0] + board[1][0] + board[2][0],
      board[0][1] + board[1][1] + board[2][1],
      board[0][2] + board[1][2] + board[2][2],
      board[0][0] + board[1][1] + board[2][2],
      board[0][2] + board[1][1] + board[2][0],
    ]
  },
  checkWin: (board) => {
    const boardState = GAME_CONFIG.setGameoverPositions(board);
    const win = boardState.find(el => el === 'XXX' || el === 'OOO');
      return win;
  }
}