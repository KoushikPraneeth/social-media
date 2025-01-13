import React from 'react';
import { type Coordinates } from '../types/sudoku';

interface CellProps {
  value: number | null;
  isInitial: boolean;
  isSelected: boolean;
  isRelated: boolean;
  hasError: boolean;
  onClick: () => void;
  isDark: boolean;
}

export function Cell({ value, isInitial, isSelected, isRelated, hasError, onClick, isDark }: CellProps) {
  return (
    <button
      className={`
        w-full h-full flex items-center justify-center text-xl font-medium
        border-r border-b border-gray-200 dark:border-gray-700 transition-colors
        ${isInitial ? 'font-bold text-gray-800 dark:text-white' : 'text-blue-600 dark:text-blue-400'}
        ${isSelected 
          ? 'bg-blue-100 dark:bg-blue-900' 
          : isRelated 
            ? 'bg-blue-50 dark:bg-blue-900/50' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
        }
        ${hasError ? 'text-red-500 dark:text-red-400' : ''}
      `}
      onClick={onClick}
    >
      {value || ''}
    </button>
  );
}