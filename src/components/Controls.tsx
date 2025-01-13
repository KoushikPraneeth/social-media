import React from 'react';
import { RefreshCw, RotateCcw, Check } from 'lucide-react';

interface ControlsProps {
  onNewGame: () => void;
  onReset: () => void;
  onSubmit: () => void;
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  isDark: boolean;
}

export function Controls({ 
  onNewGame, 
  onReset, 
  onSubmit,
  difficulty, 
  onDifficultyChange, 
  isDark 
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px]">
      <div className="flex justify-between items-center">
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Reset current game"
          >
            <RotateCcw className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={onSubmit}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Submit solution"
          >
            <Check className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={onNewGame}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="New game"
          >
            <RefreshCw className="w-5 h-5 dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
