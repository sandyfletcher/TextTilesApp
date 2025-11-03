// services/PuzzleStorageService.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PuzzleProgress } from '../types';

const STORAGE_KEY_PREFIX = '@puzzle_progress_';

/**
 * Saves puzzle progress to AsyncStorage
 */
export async function savePuzzleProgress(
  puzzleId: string,
  progress: PuzzleProgress
): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${puzzleId}`;
    const jsonValue = JSON.stringify(progress);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving puzzle progress:', error);
    throw error;
  }
}

/**
 * Loads puzzle progress from AsyncStorage
 */
export async function loadPuzzleProgress(
  puzzleId: string
): Promise<PuzzleProgress | null> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${puzzleId}`;
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading puzzle progress:', error);
    return null;
  }
}

/**
 * Deletes puzzle progress (e.g., when user wants to restart)
 */
export async function deletePuzzleProgress(puzzleId: string): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${puzzleId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error deleting puzzle progress:', error);
    throw error;
  }
}

/**
 * Calculates completion percentage based on filled cells
 */
export function calculateCompletion(
  userGrid: string[][],
  grid: (string | null)[][]
): number {
  let totalCells = 0;
  let filledCells = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== null) {
        totalCells++;
        if (userGrid[r]?.[c] && userGrid[r][c] !== '') {
          filledCells++;
        }
      }
    }
  }

  return totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;
}

/**
 * Checks if puzzle is fully completed (all correct answers locked)
 */
export function isPuzzleComplete(
  lockedGrid: boolean[][],
  grid: (string | null)[][]
): boolean {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== null && !lockedGrid[r]?.[c]) {
        return false;
      }
    }
  }
  return true;
}