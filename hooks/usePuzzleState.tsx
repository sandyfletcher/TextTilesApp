// hooks/usePuzzleState.tsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Puzzle, Clue } from '../types';
import { getClueForCell, ActiveClue } from '../utils/puzzleUtils';

// A helper to create an empty 2D array of a given size
const createGrid = <T,>(rows: number, cols: number, fill: T): T[][] => {
  return Array(rows).fill(null).map(() => Array(cols).fill(fill));
};

export function usePuzzleState(puzzle: Puzzle | null) {
  // --- Core State ---
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [lockedGrid, setLockedGrid] = useState<boolean[][]>([]);
  const [checkGrid, setCheckGrid] = useState<(boolean | null)[][]>([]);
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState<'across' | 'down'>('across');

  // --- Initialization Effect ---
  // Resets the state whenever a new puzzle is loaded
  useEffect(() => {
    if (puzzle) {
      const { rows, cols } = puzzle.size;
      setUserGrid(createGrid(rows, cols, ''));
      setLockedGrid(createGrid(rows, cols, false));
      setCheckGrid(createGrid(rows, cols, null));

      // Find the first playable cell
      let firstCell = { row: 0, col: 0 };
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (puzzle.grid[r][c] !== null) {
            firstCell = { row: r, col: c };
            setActiveCell(firstCell);
            return;
          }
        }
      }
    }
  }, [puzzle]);

  // --- Derived State ---
  // useMemo ensures this only recalculates when its dependencies change
  const activeClue = useMemo<ActiveClue | null>(() => {
    if (!puzzle) return null;
    return getClueForCell(puzzle, direction, activeCell.row, activeCell.col);
  }, [puzzle, direction, activeCell]);

  // --- Event Handlers ---

  const handleClueSelect = useCallback((clue: Clue, dir: 'across' | 'down') => {
    setDirection(dir);
    setActiveCell({ row: clue.row, col: clue.col });
  }, []);

  const handleCellPress = useCallback((row: number, col: number) => {
    if (activeCell.row === row && activeCell.col === col) {
      // Toggle direction if the same cell is pressed
      setDirection(prev => (prev === 'across' ? 'down' : 'across'));
    } else {
      setActiveCell({ row, col });
      // Smart direction selection
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
    let { row, col } = activeCell;
    const { rows, cols } = puzzle.size;

    do {
      if (direction === 'across') col++;
      else row++;
    } while (row < rows && col < cols && puzzle.grid[row][col] === null);
    
    if (row < rows && col < cols) {
        setActiveCell({ row, col });
    }
  }, [activeCell, direction, puzzle]);

  const moveToPrevCell = useCallback(() => {
    if (!puzzle) return;
    let { row, col } = activeCell;

    do {
      if (direction === 'across') col--;
      else row--;
    } while (row >= 0 && col >= 0 && puzzle.grid[row][col] === null);

    if (row >= 0 && col >= 0) {
      setActiveCell({ row, col });
    }
  }, [activeCell, direction, puzzle]);

  const handleKeyPress = useCallback((key: string) => {
    if (!puzzle || lockedGrid[activeCell.row][activeCell.col]) {
      return;
    }

    if (key === 'Backspace') {
      setUserGrid(grid => {
        const newGrid = grid.map(r => [...r]);
        // Clear current cell only if it has a letter, otherwise move back first
        if (newGrid[activeCell.row][activeCell.col] !== '') {
          newGrid[activeCell.row][activeCell.col] = '';
          return newGrid;
        } else {
          moveToPrevCell();
          return newGrid; // State update in moveToPrevCell will trigger re-render
        }
      });
    } else if (/^[a-z]$/i.test(key) && key.length === 1) {
      setUserGrid(grid => {
        const newGrid = grid.map(r => [...r]);
        newGrid[activeCell.row][activeCell.col] = key.toUpperCase();
        return newGrid;
      });
      moveToNextCell();
    }
  }, [activeCell, lockedGrid, puzzle, moveToNextCell, moveToPrevCell]);

  const checkPuzzle = useCallback(() => {
    if (!puzzle) return false;
    let isCorrect = true;
    const newLockedGrid = lockedGrid.map(r => [...r]);
    const newCheckGrid = createGrid<(boolean | null)>(puzzle.size.rows, puzzle.size.cols, null);

    for (let r = 0; r < puzzle.size.rows; r++) {
      for (let c = 0; c < puzzle.size.cols; c++) {
        if (puzzle.grid[r][c] === null) continue; // Skip black squares

        if (userGrid[r][c] === puzzle.grid[r][c]) {
          newLockedGrid[r][c] = true;
          newCheckGrid[r][c] = true;
        } else {
          newCheckGrid[r][c] = false; // Mark incorrect answers
          isCorrect = false;
        }
      }
    }
    setLockedGrid(newLockedGrid);
    setCheckGrid(newCheckGrid);
    return isCorrect;
  }, [puzzle, userGrid, lockedGrid]);

  return {
    userGrid,
    lockedGrid,
    checkGrid,
    activeCell,
    direction,
    setDirection,
    activeClue,
    handleCellPress,
    handleClueSelect,
    handleKeyPress,
    checkPuzzle,
  };
}

export type PuzzleState = ReturnType<typeof usePuzzleState>;