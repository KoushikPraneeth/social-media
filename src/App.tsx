import React, { useState, useEffect } from 'react';
import { Cell } from './components/Cell';
import { Controls } from './components/Controls';
import { Numpad } from './components/Numpad';
import { generateSudoku, validateBoard } from './utils/sudoku';
import type { Board, Coordinates, GameState } from './types/sudoku';
import { Trophy, Sun, Moon } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const board = generateSudoku('easy');
    return {
      board: board.map(row => row.map(cell => cell === 0 ? null : cell)),
      initial: board.map(row => row.map(cell => cell === 0 ? null : cell)),
      selectedCell: null,
      isValid: true,
      difficulty: 'easy',
      isComplete: false
    };
  });

  const [submissionResult, setSubmissionResult] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleCellClick = (row: number, col: number) => {
    setGameState(prev => ({
      ...prev,
      selectedCell: [row, col]
    }));
  };

  const handleSubmit = () => {
    if (gameState.board.some(row => row.some(cell => cell === null))) {
      return;
    }
    
    const isValid = validateBoard(gameState.board as number[][]);
    setSubmissionResult(isValid ? 'correct' : 'incorrect');
    setGameState(prev => ({
      ...prev,
      isValid,
      isComplete: isValid
    }));
  };

  const handleNumberSelect = (num: number) => {
    if (!gameState.selectedCell) return;
    
    const [row, col] = gameState.selectedCell;
    if (gameState.initial[row][col] !== null) return;

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = num;

    const isValid = validateBoard(newBoard as number[][]);
    const isComplete = !newBoard.some(row => row.some(cell => cell === null));
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      isValid,
      isComplete: isValid && isComplete
    }));
  };

  const handleClear = () => {
    if (!gameState.selectedCell) return;
    const [row, col] = gameState.selectedCell;
    if (gameState.initial[row][col] !== null) return;

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = null;

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      isValid: true
    }));
  };

  const startNewGame = (difficulty: 'easy' | 'medium' | 'hard' = gameState.difficulty) => {
    const board = generateSudoku(difficulty);
    setGameState({
      board: board.map(row => row.map(cell => cell === 0 ? null : cell)),
      initial: board.map(row => row.map(cell => cell === 0 ? null : cell)),
      selectedCell: null,
      isValid: true,
      difficulty,
      isComplete: false
    });
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      board: prev.initial.map(row => [...row]),
      selectedCell: null,
      isValid: true,
      isComplete: false
    }));
  };

  const isCellRelated = (row: number, col: number): boolean => {
    if (!gameState.selectedCell) return false;
    const [selectedRow, selectedCol] = gameState.selectedCell;
    
    return row === selectedRow || 
           col === selectedCol || 
           (Math.floor(row / 3) === Math.floor(selectedRow / 3) && 
            Math.floor(col / 3) === Math.floor(selectedCol / 3));
  };

  if (gameState.isComplete) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You've completed the puzzle!</p>
          <button
            onClick={() => startNewGame()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sudoku</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-gray-800 dark:text-white" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800 dark:text-white" />
          )}
        </button>
      </div>
      
      <Controls
        onNewGame={() => startNewGame()}
        onReset={resetGame}
        onSubmit={handleSubmit}
        difficulty={gameState.difficulty}
        onDifficultyChange={(diff) => startNewGame(diff)}
        isDark={isDark}
      />

      {submissionResult === 'correct' && (
        <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-4 py-2 rounded-lg">
          Correct solution! 🎉
        </div>
      )}
      
      {submissionResult === 'incorrect' && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg">
          Incorrect solution 😔 Try again!
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-[600px] w-full">
        <div className="grid grid-cols-9 gap-0 border-l border-t border-gray-200 dark:border-gray-700 aspect-square">
          {gameState.board.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={value}
                isInitial={gameState.initial[rowIndex][colIndex] !== null}
                isSelected={gameState.selectedCell?.[0] === rowIndex && gameState.selectedCell?.[1] === colIndex}
                isRelated={isCellRelated(rowIndex, colIndex)}
                hasError={!gameState.isValid && gameState.selectedCell?.[0] === rowIndex && gameState.selectedCell?.[1] === colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                isDark={isDark}
              />
            ))
          )}
        </div>
      </div>
      
      <Numpad
        onNumberSelect={handleNumberSelect}
        onClear={handleClear}
        isDark={isDark}
      />
    </div>
  );
}

export default App;
