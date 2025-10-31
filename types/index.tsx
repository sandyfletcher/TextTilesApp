// types/index.tsx
// (this will become .ts in production)

import { usePuzzleState } from "../hooks/usePuzzleState";

// Describes a single clue (either across or down).
export interface Clue {
  number: number;
  clue: string;
  row: number;
  col: number;
  answer: string;
}

// Describes the 'clues' object which contains arrays of Clue objects.
export interface Clues {
  across: Clue[];
  down: Clue[];
}

// Describes the puzzle's metadata.
export interface Metadata {
  date: string;
  title: string;
  author: string;
  editor: string;
  copyright: string;
  publisher: string;
  dow: string; // Day of Week
}

// Describes the size of the grid.
export interface GridSize {
  cols: number;
  rows: number;
}

/**
 * The enriched manifest entry, including its original file path.
 * This is the lightweight version used for populating lists.
 */
export interface PuzzleManifestEntry {
    id: string; // e.g., "nyt-1976-01-01"
    path: string; // e.g., "NYT/1976/01/01.json"
    metadata: Metadata;
}

/**
 * This is the main interface for a complete puzzle object.
 * It represents the full data loaded from a puzzle's JSON file.
 */
export interface Puzzle {
  id: string;
  metadata: Metadata;
  size: GridSize;
  grid: (string | null)[][];
  clues: Clues;
}

export interface PuzzleProgress {
  userGrid: string[][];
  lockedGrid: boolean[][];
  checkGrid: (boolean | null)[][];
  lastPlayed: string;
  percentComplete: number;
  isCompleted: boolean;
}

/**
 * Represents a node in our puzzle hierarchy tree.
 * A node can be a folder, which contains other nodes (children) and/or puzzles.
 */
export interface PuzzleTreeNode {
  name: string;
  children: PuzzleTreeNode[];
  puzzles: PuzzleManifestEntry[];
}


/**
 * Represents a single, flattened item in our list for use with FlatList.
 * This structure is designed for high-performance virtualized lists.
 */
export interface FlatListItem {
  id: string;
  parentId: string | null;
  level: number;
  type: 'collection' | 'folder' | 'puzzle';
  data: PuzzleTreeNode | PuzzleManifestEntry;
}

/**
 * Represents the return type of our core game logic hook.
 * This makes it easy to pass all game state and handlers as a single prop.
 */
export type PuzzleState = ReturnType<typeof usePuzzleState>;