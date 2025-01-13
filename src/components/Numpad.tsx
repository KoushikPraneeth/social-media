import React from 'react';

interface NumpadProps {
  onNumberSelect: (num: number) => void;
  onClear: () => void;
  isDark: boolean;
}

export function Numpad({ onNumberSelect, onClear, isDark }: NumpadProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5 w-full max-w-[600px]">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => onNumberSelect(num)}
          className="aspect-square flex items-center justify-center text-lg font-medium
                   bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                   rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                   transition-colors dark:text-white"
        >
          {num}
        </button>
      ))}
      <button
        onClick={onClear}
        className="aspect-square flex items-center justify-center text-lg font-medium
                 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                 transition-colors dark:text-white"
      >
        ⌫
      </button>
    </div>
  );
}
