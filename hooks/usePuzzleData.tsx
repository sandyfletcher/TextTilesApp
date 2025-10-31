// hooks/usePuzzleData.tsx

import { useState, useEffect } from 'react';
import { Puzzle } from '../types';
import { puzzleMap } from '../services/puzzle-map';

export function usePuzzleData(id: string | undefined) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when the ID changes
    setPuzzle(null);
    setIsLoading(true);
    setError(null);

    if (!id) {
      setError('No puzzle ID provided.');
      setIsLoading(false);
      return;
    }

    const loadPuzzle = async () => {
      try {
        const puzzleLoader = puzzleMap[id];
        if (!puzzleLoader) {
          throw new Error(`Puzzle with ID "${id}" not found.`);
        }
        
        // The dynamic import() returns a module with a 'default' export
        const puzzleModule = await puzzleLoader();
        
        // Validate that the puzzle has the expected structure
        if (!puzzleModule.default || !puzzleModule.default.grid || !puzzleModule.default.clues) {
          throw new Error('Invalid puzzle data structure.');
        }
        
        setPuzzle(puzzleModule.default);

      } catch (error) {
        // More specific error handling
        if (error instanceof Error) {
          setError(error.message);
        } else if (typeof error === 'string') {
          setError(error);
        } else {
          setError('An unexpected error occurred while loading the puzzle.');
        }
        console.error('Error loading puzzle:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPuzzle();
  }, [id]);

  return { puzzle, isLoading, error };
}