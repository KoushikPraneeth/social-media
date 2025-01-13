export function generateSudoku(difficulty: 'easy' | 'medium' | 'hard'): number[][] {
  // Initialize empty board
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // Fill diagonal boxes first (these are independent)
  fillDiagonalBoxes(board);
  
  // Solve the rest of the board
  solveSudoku(board);
  
  // Remove numbers based on difficulty
  const cellsToRemove = {
    easy: 30,
    medium: 45,
    hard: 55
  }[difficulty];
  
  return removeNumbers(board, cellsToRemove);
}

function fillDiagonalBoxes(board: number[][]) {
  for (let box = 0; box < 9; box += 3) {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[box + i][box + j] = nums[i * 3 + j];
      }
    }
  }
}

function solveSudoku(board: number[][]): boolean {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true;
  
  const [row, col] = emptyCell;
  
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0;
    }
  }
  
  return false;
}

function findEmptyCell(board: number[][]): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!board[row][col]) return [row, col];
    }
  }
  return null;
}

function isValid(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  
  // Check column
  for (let y = 0; y < 9; y++) {
    if (board[y][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }
  
  return true;
}

function removeNumbers(board: number[][], count: number): number[][] {
  const result = board.map(row => [...row]);
  const positions = shuffle(Array.from({ length: 81 }, (_, i) => i));
  
  for (let i = 0; i < count; i++) {
    const pos = positions[i];
    const row = Math.floor(pos / 9);
    const col = pos % 9;
    result[row][col] = 0;
  }
  
  return result;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function validateBoard(board: number[][]): boolean {
  // Check rows
  for (let row = 0; row < 9; row++) {
    if (!isValidSet(board[row])) return false;
  }
  
  // Check columns
  for (let col = 0; col < 9; col++) {
    const column = board.map(row => row[col]);
    if (!isValidSet(column)) return false;
  }
  
  // Check boxes
  for (let box = 0; box < 9; box++) {
    const boxRow = Math.floor(box / 3) * 3;
    const boxCol = (box % 3) * 3;
    const numbers = [];
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        numbers.push(board[boxRow + i][boxCol + j]);
      }
    }
    
    if (!isValidSet(numbers)) return false;
  }
  
  return true;
}

function isValidSet(numbers: number[]): boolean {
  const seen = new Set();
  for (const num of numbers) {
    if (num === 0) continue;
    if (seen.has(num)) return false;
    seen.add(num);
  }
  return true;
}