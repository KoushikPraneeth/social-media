export const generateSudoku = () => {
      let board = Array.from({ length: 9 }, () => Array(9).fill(0));
      fillSudoku(board);
      removeNumbers(board, 40); // Adjust difficulty by changing the number of removed numbers
      return board;
    };

    const fillSudoku = (board) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValidMove(board, i, j, num)) {
                board[i][j] = num;
                if (fillSudoku(board)) {
                  return true;
                } else {
                  board[i][j] = 0;
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    export const isValidMove = (board, row, col, num) => {
      for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) {
          return false;
        }
      }
      let startRow = Math.floor(row / 3) * 3;
      let startCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i + startRow][j + startCol] === num) {
            return false;
          }
        }
      }
      return true;
    };

    const removeNumbers = (board, count) => {
      while (count > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
          board[row][col] = 0;
          count--;
        }
      }
    };

    export const isBoardComplete = (board) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) {
            return false;
          }
        }
      }
      return true;
    };
