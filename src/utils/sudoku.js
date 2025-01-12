function generateSudoku(difficulty) {
      let grid = Array(9).fill(null).map(() => Array(9).fill(0));

      function isValid(grid, row, col, num) {
        for (let i = 0; i < 9; i++) {
          if (grid[row][i] === num || grid[i][col] === num) return false;
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
          for (let j = startCol; j < startCol + 3; j++) {
            if (grid[i][j] === num) return false;
          }
        }
        return true;
      }

      function fillGrid() {
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
              const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
              for (const num of nums) {
                if (isValid(grid, row, col, num)) {
                  grid[row][col] = num;
                  if (fillGrid()) return true;
                  else grid[row][col] = 0;
                }
              }
              return false;
            }
          }
        }
        return true;
      }

      fillGrid();

      let clues = 0;
      switch (difficulty) {
        case 'easy': clues = 45; break;
        case 'medium': clues = 35; break;
        case 'hard': clues = 25; break;
        default: clues = 40;
      }

      let puzzle = grid.map(row => [...row]);
      let removed = 0;
      while (removed < 81 - clues) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
          puzzle[row][col] = 0;
          removed++;
        }
      }

      return { puzzle, solution: grid };
    }

    function validateMove(grid, row, col, num) {
      if (num === 0) return true;
      for (let i = 0; i < 9; i++) {
        if ((grid[row][i] === num && i !== col) || (grid[i][col] === num && i !== row)) return false;
      }
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (grid[i][j] === num && (i !== row || j !== col)) return false;
        }
      }
      return true;
    }

    function isSolved(grid, solution) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] !== solution[row][col]) {
            return false;
          }
        }
      }
      return true;
    }

    export { generateSudoku, validateMove, isSolved };
