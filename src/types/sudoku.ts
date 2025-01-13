export type CellValue = number | null;
export type Board = CellValue[][];
export type Coordinates = [number, number];

export interface GameState {
  board: Board;
  initial: Board;
  selectedCell: Coordinates | null;
  isValid: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  isComplete: boolean;
}
