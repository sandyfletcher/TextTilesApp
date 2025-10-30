// services/PuzzleService.tsx

import { PuzzleManifestEntry, PuzzleTreeNode, FlatListItem } from '../types';

// Statically import the manifest file. Metro bundler will handle this efficiently.
import manifest from '../assets/puzzles/puzzles.json';

let puzzleTree: PuzzleTreeNode | null = null;
const manifestData: PuzzleManifestEntry[] = manifest as PuzzleManifestEntry[];

/**
 * Parses the puzzle manifest and builds a hierarchical tree structure.
 * The result is cached in memory for performance.
 * @returns {PuzzleTreeNode} The root of the puzzle tree.
 */
export function getPuzzleTree(): PuzzleTreeNode {
  // If the tree has already been built, return the cached version.
  if (puzzleTree) {
    return puzzleTree;
  }

  const root: PuzzleTreeNode = { name: 'All Collections', children: [], puzzles: [] };

  // Iterate over each puzzle in the manifest
  for (const puzzle of manifestData) {
    // The path "NYT/1976/01/01.json" becomes ["NYT", "1976", "01"]
    const pathParts = puzzle.path.split('/').slice(0, -1);
    let currentNode = root;

    // Traverse or create nodes for each part of the path
    for (const part of pathParts) {
      let childNode = currentNode.children.find(child => child.name === part);
      if (!childNode) {
        childNode = { name: part, children: [], puzzles: [] };
        currentNode.children.push(childNode);
      }
      currentNode = childNode;
    }

    // Add the puzzle to the final node in the path
    currentNode.puzzles.push(puzzle);
  }

  // Cache the generated tree
  puzzleTree = root;
  return puzzleTree;
}

/**
 * Flattens the puzzle tree into a list suitable for a FlatList component.
 * It recursively traverses the tree and respects which folders are expanded.
 * @param {Set<string>} expandedFolders - A set of unique IDs for currently expanded folders.
 * @returns {FlatListItem[]} An array of items to be rendered in the list.
 */
export function getVisiblePuzzles(expandedFolders: Set<string>): FlatListItem[] {
  const visibleItems: FlatListItem[] = [];
  const rootNode = getPuzzleTree();

  // Helper function to recursively process each node
  const traverse = (node: PuzzleTreeNode, level: number, parentId: string | null) => {
    // Determine the type and ID for the current node
    const isCollection = level === 1;
    const itemType = isCollection ? 'collection' : 'folder';
    const itemId = `${parentId ? parentId + '-' : ''}${node.name.replace(/\s+/g, '-')}`;

    // Add the collection/folder itself to the list
    visibleItems.push({
      id: itemId,
      parentId,
      level,
      type: itemType,
      data: node,
    });

    // If the folder is expanded, process its children and puzzles
    if (expandedFolders.has(itemId)) {
      // Add child folders (collections)
      node.children.forEach(child => traverse(child, level + 1, itemId));

      // Add puzzles
      node.puzzles.forEach(puzzle => {
        visibleItems.push({
          id: `puzzle-${puzzle.id}`,
          parentId: itemId,
          level: level + 1,
          type: 'puzzle',
          data: puzzle,
        });
      });
    }
  };

  // Start the traversal from the root's children (e.g., "NYT")
  rootNode.children.forEach(collection => traverse(collection, 1, 'root'));

  return visibleItems;
}