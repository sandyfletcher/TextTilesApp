// hooks/usePuzzleProgress.tsx

import { useState, useEffect } from 'react';
import { PuzzleProgress } from '../types';
import { loadPuzzleProgress } from '../services/PuzzleStorageService';

/**
 * Hook to load puzzle progress for display in lists
 */
export function usePuzzleProgress(puzzleId: string) {
  const [progress, setProgress] = useState<PuzzleProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      try {
        const savedProgress = await loadPuzzleProgress(puzzleId);
        if (isMounted) {
          setProgress(savedProgress);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading puzzle progress:', error);
        if (isMounted) {
          setProgress(null);
          setIsLoading(false);
        }
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [puzzleId]);

  return { progress, isLoading };
}