import React, { useState, useRef, useEffect, Suspense } from 'react';
    import { Canvas, useLoader, useFrame } from '@react-three/fiber';
    import { OrbitControls, PerspectiveCamera, Text, Instances, Instance } from '@react-three/drei';
    import { AmbientLight, DirectionalLight, AudioLoader, Audio } from 'three';
    import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
    import { generateSudoku, validateMove, isSolved } from './utils/sudoku';
    import useStore from './store';
    import './App.css';

    function LoadingScreen() {
      return <div className="loading-screen">Loading...</div>;
    }

    function Grid({ initialGrid, onCellChange, selectedCell, setSelectedCell }) {
      const gridSize = 9;
      const cubeSize = 1;
      const gridRef = useRef();
      const [currentGrid, setCurrentGrid] = useState(initialGrid);
      const [conflicts, setConflicts] = useState({});
      const font = useLoader(FontLoader, '/fonts/helvetiker_regular.typeface.json');
      const [hoveredCell, setHoveredCell] = useState(null);
      const theme = useStore((state) => state.theme);
      const soundEnabled = useStore((state) => state.soundEnabled);
      const clickSound = useLoader(AudioLoader, '/sounds/click.mp3');
      const audioRef = useRef(new Audio(new AudioListener()));

      useEffect(() => {
        setCurrentGrid(initialGrid);
      }, [initialGrid]);

      useEffect(() => {
        if (clickSound) {
          audioRef.current.setBuffer(clickSound);
        }
      }, [clickSound]);

      const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });
        if (soundEnabled) {
          audioRef.current.play();
        }
      };

      const handleCellChange = (row, col, num) => {
        const newGrid = currentGrid.map(row => [...row]);
        newGrid[row][col] = num;
        setCurrentGrid(newGrid);
        onCellChange(newGrid);

        const newConflicts = {};
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (!validateMove(newGrid, r, c, newGrid[r][c])) {
              newConflicts[`${r}-${c}`] = true;
            }
          }
        }
        setConflicts(newConflicts);
      };

      const cubeColor = (row, col, cell) => {
        if (conflicts[`${row}-${col}`]) return 'red';
        if (selectedCell?.row === row && selectedCell?.col === col) return 'lightblue';
        if (cell === 0) return theme === 'light' ? '#444' : '#222';
        return theme === 'light' ? '#888' : '#aaa';
      };

      return (
        <group ref={gridRef}>
          <Instances limit={gridSize * gridSize} material={new THREE.MeshStandardMaterial()}>
            {currentGrid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Instance
                  key={`${rowIndex}-${colIndex}`}
                  position={[colIndex - gridSize / 2 + 0.5, rowIndex - gridSize / 2 + 0.5, 0]}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onPointerOver={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                  onPointerOut={() => setHoveredCell(null)}
                  scale={hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex ? 1.1 : 1}
                  color={cubeColor(rowIndex, colIndex, cell)}
                >
                  <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
                  {cell !== 0 && font && (
                    <Text
                      position={[0, 0, cubeSize / 2 + 0.01]}
                      font={font}
                      fontSize={0.5}
                      color={theme === 'light' ? 'white' : 'black'}
                      anchorX="center"
                      anchorY="middle"
                    >
                      {String(cell)}
                    </Text>
                  )}
                </Instance>
              ))
            )}
          </Instances>
        </group>
      );
    }

    function NumberPad({ onNumberClick }) {
      const theme = useStore((state) => state.theme);
      return (
        <div className={`number-pad ${theme}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button key={num} onClick={() => onNumberClick(num)}>
              {num}
            </button>
          ))}
          <button onClick={() => onNumberClick(0)}>Clear</button>
        </div>
      );
    }

    function Timer({ isRunning, onTimeChange }) {
      const [seconds, setSeconds] = useState(0);
      const timerRef = useRef(null);

      useEffect(() => {
        if (isRunning) {
          timerRef.current = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
          }, 1000);
        } else {
          clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
      }, [isRunning]);

      useEffect(() => {
        onTimeChange(seconds);
      }, [seconds, onTimeChange]);

      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
      };

      return <div className="timer">Time: {formatTime(seconds)}</div>;
    }

    function App() {
      const [game, setGame] = useState(null);
      const [difficulty, setDifficulty] = useState('medium');
      const [selectedCell, setSelectedCell] = useState(null);
      const [history, setHistory] = useState([]);
      const [historyIndex, setHistoryIndex] = useState(-1);
      const [timerRunning, setTimerRunning] = useState(false);
      const [time, setTime] = useState(0);
      const [score, setScore] = useState(0);
      const [isSolvedState, setIsSolvedState] = useState(false);
      const theme = useStore((state) => state.theme);
      const setTheme = useStore((state) => state.setTheme);
      const soundEnabled = useStore((state) => state.soundEnabled);
      const setSoundEnabled = useStore((state) => state.setSoundEnabled);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        loadGame();
      }, []);

      useEffect(() => {
        if (game && isSolved(game.puzzle, game.solution)) {
          setTimerRunning(false);
          setIsSolvedState(true);
        }
      }, [game]);

      const loadGame = () => {
        const savedGame = localStorage.getItem('sudokuGame');
        if (savedGame) {
          const parsedGame = JSON.parse(savedGame);
          setGame(parsedGame);
          setHistory(parsedGame.history || []);
          setHistoryIndex(parsedGame.historyIndex || -1);
          setTime(parsedGame.time || 0);
          setScore(parsedGame.score || 0);
        } else {
          newGame();
        }
        setLoading(false);
      };

      const saveGame = (grid) => {
        const gameData = { ...game, puzzle: grid, history, historyIndex, time, score };
        localStorage.setItem('sudokuGame', JSON.stringify(gameData));
        setGame(gameData);
      };

      const newGame = () => {
        const newGameData = generateSudoku(difficulty);
        setGame(newGameData);
        setSelectedCell(null);
        setHistory([]);
        setHistoryIndex(-1);
        setTimerRunning(true);
        setTime(0);
        setScore(0);
        setIsSolvedState(false);
      };

      const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
      };

      const handleCellChange = (grid) => {
        setHistory((prevHistory) => {
          const newHistory = [...prevHistory.slice(0, historyIndex + 1), grid];
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
        });
        saveGame(grid);
      };

      const handleNumberClick = (num) => {
        if (selectedCell) {
          const { row, col } = selectedCell;
          const newPuzzle = game.puzzle.map(row => [...row]);
          newPuzzle[row][col] = num;
          setGame({ ...game, puzzle: newPuzzle });
          saveGame(newPuzzle);
          setSelectedCell(null);
          setScore(prevScore => prevScore + 1);
        }
      };

      const handleUndo = () => {
        if (historyIndex > 0) {
          setHistoryIndex(historyIndex - 1);
          setGame({ ...game, puzzle: history[historyIndex - 1] });
        }
      };

      const handleRedo = () => {
        if (historyIndex < history.length - 1) {
          setHistoryIndex(historyIndex + 1);
          setGame({ ...game, puzzle: history[historyIndex + 1] });
        }
      };

      const handleTimeChange = (newTime) => {
        setTime(newTime);
      };

      const handleThemeChange = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      };

      const handleSoundToggle = () => {
        setSoundEnabled(!soundEnabled);
      };

      return (
        <div className={`app-container ${theme}`}>
          {loading ? (
            <LoadingScreen />
          ) : (
            <>
              <div className="ui-overlay">
                <h1>3D Sudoku</h1>
                <p>A 3D Sudoku Game</p>
                <select value={difficulty} onChange={handleDifficultyChange}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <button onClick={newGame}>New Game</button>
                <button onClick={handleUndo} disabled={historyIndex <= 0}>Undo</button>
                <button onClick={handleRedo} disabled={historyIndex >= history.length - 1}>Redo</button>
                <Timer isRunning={timerRunning} onTimeChange={handleTimeChange} />
                <div className="score">Score: {score}</div>
                <NumberPad onNumberClick={handleNumberClick} />
                <button onClick={handleThemeChange}>
                  {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
                </button>
                <button onClick={handleSoundToggle}>
                  {soundEnabled ? 'Disable Sound' : 'Enable Sound'}
                </button>
                {isSolvedState && <div className="victory-message">Congratulations! You solved the puzzle!</div>}
              </div>
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 20]} />
                <AmbientLight intensity={0.5} />
                <DirectionalLight position={[10, 10, 5]} intensity={0.8} />
                <OrbitControls />
                <Suspense fallback={null}>
                  {game && (
                    <Grid
                      initialGrid={game.puzzle}
                      onCellChange={handleCellChange}
                      selectedCell={selectedCell}
                      setSelectedCell={setSelectedCell}
                    />
                  )}
                </Suspense>
              </Canvas>
            </>
          )}
        </div>
      );
    }

    export default App;
