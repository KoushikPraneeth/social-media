import React, { useState, useEffect } from 'react';
    import { generateSudoku, isValidMove, isBoardComplete } from './sudokuLogic';

    const App = () => {
      const [board, setBoard] = useState([]);
      const [initialBoard, setInitialBoard] = useState([]);

      useEffect(() => {
        const newBoard = generateSudoku();
        setBoard(newBoard);
        setInitialBoard(JSON.parse(JSON.stringify(newBoard))); // Deep copy
      }, []);

      const handleInputChange = (row, col, value) => {
        if (initialBoard[row][col] === 0) {
          const newBoard = [...board];
          newBoard[row][col] = value === '' ? 0 : parseInt(value, 10);
          setBoard(newBoard);
        }
      };

      const checkSolution = () => {
        if (isBoardComplete(board) && board.every((row, i) => row.every((cell, j) => isValidMove(board, i, j, cell)))) {
          alert('Congratulations! You solved the Sudoku!');
        } else {
          alert('Not quite right. Keep trying!');
        }
      };

      return (
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-8">Sudoku</h1>
          <div className="grid grid-cols-9 gap-1 border border-gray-800">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="number"
                  min="1"
                  max="9"
                  value={cell === 0 ? '' : cell}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  className={`w-full h-12 text-center border border-gray-300 focus:outline-none ${
                    initialBoard[rowIndex][colIndex] !== 0 ? 'bg-gray-200' : ''
                  } ${rowIndex % 3 === 2 ? 'border-b-gray-800' : ''} ${
                    colIndex % 3 === 2 ? 'border-r-gray-800' : ''
                  }`}
                  disabled={initialBoard[rowIndex][colIndex] !== 0}
                />
              ))
            )}
          </div>
          <button onClick={checkSolution} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Check Solution
          </button>
        </div>
      );
    };

    export default App;
