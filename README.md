# Sudoku Game

A React-based Sudoku game built with TypeScript, Vite, and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Running the Development Server
```bash
npm run dev
```
The application will be available at:
- Local: http://localhost:5174/
- Network: Use --host to expose

### Game Controls
- Click on cells to select them
- Use the number pad to enter values
- Use backspace to clear a cell
- The game will validate your solution automatically

## Project Structure
- `src/` - Main application source code
  - `components/` - React components
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
- `public/` - Static assets
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
