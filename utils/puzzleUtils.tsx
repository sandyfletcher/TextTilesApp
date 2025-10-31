// utils/puzzleUtils.tsx

import { Clue, Puzzle } from "../types";

export interface ActiveClue extends Clue {
  direction: 'across' | 'down';
}

/**
 * Finds the specific 'across' clue that passes through a given cell.
 */
function findAcrossClueAt(clues: Clue[], row: number, col: number): Clue | null {
  return clues.find(clue => 
    clue.row === row && col >= clue.col && col < clue.col + clue.answer.length
  ) || null;
}

/**
 * Finds the specific 'down' clue that passes through a given cell.
 */
function findDownClueAt(clues: Clue[], row: number, col: number): Clue | null {
  return clues.find(clue => 
    clue.col === col && row >= clue.row && row < clue.row + clue.answer.length
  ) || null;
}

/**
 * Gets the active clue information for a given cell and direction.
 * This is now more reliable because it calls the specific finder function.
 */
export function getClueForCell(puzzle: Puzzle, direction: 'across' | 'down', row: number, col: number): ActiveClue | null {
  const clue = direction === 'across'
    ? findAcrossClueAt(puzzle.clues.across, row, col)
    : findDownClueAt(puzzle.clues.down, row, col);

  if (!clue) {
    return null;
  }

  return { ...clue, direction };
}