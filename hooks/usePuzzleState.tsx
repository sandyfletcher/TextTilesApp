// hooks/usePuzzleState.tsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Puzzle, Clue, PuzzleProgress } from '../types';
import { getClueForCell, ActiveClue } from '../utils/puzzleUtils';
import { 
  savePuzzleProgress, 
  loadPuzzleProgress, 
  calculateCompletion, 
  isPuzzleComplete 
} from '../services/PuzzleStorageService';

// A helper to create an empty 2D array of a given size
const createGrid = <T,>(rows: number, cols: number, fill: T): T[][] => {
  return Array(rows).fill(null).map(() => Array(cols).fill(fill));
};

interface PuzzleSettings {
  lockCorrectAnswers?: boolean; 
}

export function usePuzzleState(puzzle: Puzzle | null, settings: PuzzleSettings = { lockCorrectAnswers: true }) {
  // --- Core State ---
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [lockedGrid, setLockedGrid] = useState<boolean[][]>([]);
  const [checkGrid, setCheckGrid] = useState<(boolean | null)[][]>([]);
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [isChecking, setIsChecking] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Track if progress has been loaded
  const [resetTrigger, setResetTrigger] = useState(0); // Used to force re-initialization

  // --- Initialization Effect ---
  // Loads saved progress or initializes a new puzzle
  useEffect(() => {
    if (!puzzle) return;

    const initializePuzzle = async () => {
      const { rows, cols } = puzzle.size;
      
      // Try to load saved progress
      const savedProgress = await loadPuzzleProgress(puzzle.id);
      
      if (savedProgress) {
        // Restore saved state
        setUserGrid(savedProgress.userGrid);
        setLockedGrid(savedProgress.lockedGrid);
        setCheckGrid(savedProgress.checkGrid);
      } else {
        // Initialize new puzzle
        setUserGrid(createGrid(rows, cols, ''));
        setLockedGrid(createGrid(rows, cols, false));
        setCheckGrid(createGrid(rows, cols, null));
      }

      // Find the first playable cell
      let firstCell = { row: 0, col: 0 };
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (puzzle.grid[r][c] !== null) {
            firstCell = { row: r, col: c };
            setActiveCell(firstCell);
            break;
          }
        }
        if (firstCell.row !== 0 || firstCell.col !== 0) break;
      }

      setIsLoaded(true);
    };

    setIsLoaded(false);
    initializePuzzle();
  }, [puzzle, resetTrigger]);

  // --- Auto-save Effect ---
  // Saves progress whenever userGrid, lockedGrid, or checkGrid changes
  useEffect(() => {
    if (!puzzle || !isLoaded) return;

    const saveProgress = async () => {
      const percentComplete = calculateCompletion(userGrid, puzzle.grid);
      const isCompleted = isPuzzleComplete(lockedGrid, puzzle.grid);

      const progress: PuzzleProgress = {
        userGrid,
        lockedGrid,
        checkGrid,
        lastPlayed: new Date().toISOString(),
        percentComplete,
        isCompleted,
      };

      await savePuzzleProgress(puzzle.id, progress);
    };

    // Debounce saves to avoid excessive writes
    const timeoutId = setTimeout(saveProgress, 500);
    return () => clearTimeout(timeoutId);
  }, [userGrid, lockedGrid, checkGrid, puzzle, isLoaded]);

  // --- Derived State ---
  const activeClue = useMemo<ActiveClue | null>(() => {
    if (!puzzle) return null;
    return getClueForCell(puzzle, direction, activeCell.row, activeCell.col);
  }, [puzzle, direction, activeCell]);

  // --- Helper: Cell Logic ---
  const isCellSkippable = useCallback((row: number, col: number, currentPuzzle: Puzzle) => {
    if (row < 0 || row >= currentPuzzle.size.rows || col < 0 || col >= currentPuzzle.size.cols) return false;
    if (currentPuzzle.grid[row][col] === null) return true;
    if (lockedGrid[row][col]) return true;
    return false;
  }, [lockedGrid]);

  // --- Helper: Navigation ---

  const navigateByArrow = useCallback((dRow: number, dCol: number) => {
    if (!puzzle) return;
    const currentPuzzle = puzzle; 
    const { rows, cols } = currentPuzzle.size;
    
    let newRow = activeCell.row + dRow;
    let newCol = activeCell.col + dCol;

    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) return;

    // Skip Black AND Locked cells
    while (
      newRow >= 0 && newRow < rows && 
      newCol >= 0 && newCol < cols && 
      isCellSkippable(newRow, newCol, currentPuzzle)
    ) {
        newRow += dRow;
        newCol += dCol;
    }

    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      if (currentPuzzle.grid[newRow][newCol] !== null) {
        setActiveCell({ row: newRow, col: newCol });
        // REMOVED: Auto-switching direction logic.
        // Now the cursor just moves, but the orientation (Across/Down) stays sticky.
      }
    }
  }, [activeCell, puzzle, isCellSkippable]);

  const navigateByTab = useCallback((isReverse: boolean) => {
    if (!puzzle || !activeClue) return;
    const currentPuzzle = puzzle;

    const currentList = direction === 'across' ? currentPuzzle.clues.across : currentPuzzle.clues.down;
    const currentIndex = currentList.findIndex(c => c.number === activeClue.number);

    let nextClue: Clue | undefined;
    let nextDirection = direction;

    if (isReverse) {
        if (currentIndex > 0) {
            nextClue = currentList[currentIndex - 1];
        } else {
            nextDirection = direction === 'across' ? 'down' : 'across';
            const newList = nextDirection === 'across' ? currentPuzzle.clues.across : currentPuzzle.clues.down;
            nextClue = newList[newList.length - 1];
        }
    } else {
        if (currentIndex < currentList.length - 1) {
            nextClue = currentList[currentIndex + 1];
        } else {
            nextDirection = direction === 'across' ? 'down' : 'across';
            const newList = nextDirection === 'across' ? currentPuzzle.clues.across : currentPuzzle.clues.down;
            nextClue = newList[0];
        }
    }

    if (nextClue) {
        setDirection(nextDirection);
        setActiveCell({ row: nextClue.row, col: nextClue.col });
    }

  }, [puzzle, activeClue, direction]);


  // --- Event Handlers ---

  const handleClueSelect = useCallback((clue: Clue, dir: 'across' | 'down') => {
    setDirection(dir);
    setActiveCell({ row: clue.row, col: clue.col });
  }, []);

  const handleCellPress = useCallback((row: number, col: number) => {
    if (activeCell.row === row && activeCell.col === col) {
      setDirection(prev => (prev === 'across' ? 'down' : 'across'));
    } else {
      setActiveCell({ row, col });
      if (puzzle) {
        const across = getClueForCell(puzzle, 'across', row, col);
        const down = getClueForCell(puzzle, 'down', row, col);
        if (direction === 'across' && across) setDirection('across');
        else if (direction === 'down' && down) setDirection('down');
        else setDirection(across ? 'across' : 'down');
      }
    }
  }, [activeCell, direction, puzzle]);
  
  const moveToNextCell = useCallback(() => {
    if (!puzzle) return;
    const currentPuzzle = puzzle;
    const { rows, cols } = currentPuzzle.size;
    
    let { row, col } = activeCell;
    let attempts = 0;
    const maxAttempts = rows * cols;

    while (attempts < maxAttempts) {
        if (direction === 'across') {
            col++;
            if (col >= cols) {
                col = 0;
                row++;
                if (row >= rows) row = 0;
            }
        } else {
            row++;
            if (row >= rows) {
                row = 0;
                col++;
                if (col >= cols) col = 0;
            }
        }

        attempts++;

        if (!isCellSkippable(row, col, currentPuzzle)) {
            setActiveCell({ row, col });
            break;
        }
    }
  }, [activeCell, direction, puzzle, isCellSkippable]);

  const handleKeyPress = useCallback((key: string, modifiers?: { shift?: boolean }) => {
    if (!puzzle) return;
    const currentPuzzle = puzzle;

    const isCurrentLocked = lockedGrid[activeCell.row][activeCell.col];

    setCheckGrid(grid => {
      const currentCheck = grid[activeCell.row]?.[activeCell.col];
      if (currentCheck !== null) {
        return createGrid<(boolean | null)>(currentPuzzle.size.rows, currentPuzzle.size.cols, null);
      }
      return grid;
    });

    switch (key) {
        case 'ArrowUp': navigateByArrow(-1, 0); return;
        case 'ArrowDown': navigateByArrow(1, 0); return;
        case 'ArrowLeft': navigateByArrow(0, -1); return;
        case 'ArrowRight': navigateByArrow(0, 1); return;
        case 'Tab': navigateByTab(!!modifiers?.shift); return;
    }

    if (key === 'Backspace') {
        if (isCurrentLocked) {
            let { row, col } = activeCell;
            do {
                if (direction === 'across') col--;
                else row--;
            } while (row >= 0 && col >= 0 && isCellSkippable(row, col, currentPuzzle));

            if (row >= 0 && col >= 0) {
                setActiveCell({ row, col });
                setUserGrid(grid => {
                    const newGrid = grid.map(r => [...r]);
                    newGrid[row][col] = '';
                    return newGrid;
                });
            }
            return;
        }

        setUserGrid(grid => {
            const newGrid = grid.map(r => [...r]);
            if (newGrid[activeCell.row][activeCell.col] !== '') {
                newGrid[activeCell.row][activeCell.col] = '';
            } else {
                let { row, col } = activeCell;
                do {
                    if (direction === 'across') col--;
                    else row--;
                } while (row >= 0 && col >= 0 && isCellSkippable(row, col, currentPuzzle));

                if (row >= 0 && col >= 0) {
                    newGrid[row][col] = '';
                    setActiveCell({ row, col });
                }
            }
            return newGrid;
        });
    } 
    
    else if (/^[a-z]$/i.test(key) && key.length === 1) {
      if (isCurrentLocked) {
         moveToNextCell();
         return;
      }

      setUserGrid(grid => {
        const newGrid = grid.map(r => [...r]);
        newGrid[activeCell.row][activeCell.col] = key.toUpperCase();
        return newGrid;
      });
      moveToNextCell();
    }
  }, [activeCell, lockedGrid, puzzle, moveToNextCell, direction, navigateByArrow, navigateByTab, isCellSkippable]);

  const checkPuzzle = useCallback(() => {
    if (!puzzle || isChecking) return false;
    const currentPuzzle = puzzle;
    
    setIsChecking(true);
    setTimeout(() => setIsChecking(false), 2000);

    let allCorrect = true;
    const newLockedGrid = lockedGrid.map(r => [...r]);
    const newCheckGrid = createGrid<(boolean | null)>(currentPuzzle.size.rows, currentPuzzle.size.cols, null);

    for (let r = 0; r < currentPuzzle.size.rows; r++) {
      for (let c = 0; c < currentPuzzle.size.cols; c++) {
        if (currentPuzzle.grid[r][c] === null) continue;

        const userAnswer = userGrid[r][c];
        const correctAnswer = currentPuzzle.grid[r][c];

        if (userAnswer) {
          if (userAnswer === correctAnswer) {
            if (settings.lockCorrectAnswers) {
                newLockedGrid[r][c] = true;
            }
            newCheckGrid[r][c] = true;
          } else {
            newCheckGrid[r][c] = false;
            allCorrect = false;
          }
        }
      }
    }

    setLockedGrid(newLockedGrid);
    setCheckGrid(newCheckGrid);
    
    return allCorrect;
  }, [puzzle, userGrid, lockedGrid, isChecking, settings.lockCorrectAnswers]);

  const resetPuzzle = useCallback(() => {
    setResetTrigger(prev => prev + 1);
  }, []);

  return {
    userGrid,
    lockedGrid,
    checkGrid,
    activeCell,
    direction,
    setDirection,
    activeClue,
    isChecking,
    handleCellPress,
    handleClueSelect,
    handleKeyPress,
    checkPuzzle,
    resetPuzzle,
  };
}

export type PuzzleState = ReturnType<typeof usePuzzleState>;