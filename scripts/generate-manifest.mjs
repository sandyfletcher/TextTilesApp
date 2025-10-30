// generate-manifest.mjs

import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
const PUZZLES_DIR = './assets/puzzles'; // The directory where your puzzles are stored
const MANIFEST_OUTPUT_PATH = './assets/puzzles/puzzles.json'; // Where to save the output file

/**
 * Recursively scans a directory for .json files and extracts their metadata.
 * @param {string} dirPath The directory to scan.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of puzzle manifest entries.
 */
async function scanDirectoryForPuzzles(dirPath) {
  const entries = [];
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        // If it's a directory, recurse into it and add its findings
        const nestedEntries = await scanDirectoryForPuzzles(fullPath);
        entries.push(...nestedEntries);
      } else if (path.extname(file.name).toLowerCase() === '.json' && file.name !== 'puzzles.json') {
        // If it's a JSON file (and not the manifest itself), process it
        try {
          const fileContent = await fs.readFile(fullPath, 'utf8');
          const puzzleData = JSON.parse(fileContent);

          // We only need specific fields for the manifest
          if (puzzleData.id && puzzleData.metadata && puzzleData.metadata.title) {
            const relativePath = path.relative(PUZZLES_DIR, fullPath).replace(/\\/g, '/');
            entries.push({
              id: puzzleData.id,
              path: relativePath,
              metadata: {
                title: puzzleData.metadata.title,
                author: puzzleData.metadata.author,
                copyright: puzzleData.metadata.copyright,
                date: puzzleData.metadata.date,
                dow: puzzleData.metadata.dow,
                editor: puzzleData.metadata.editor,
                publisher: puzzleData.metadata.publisher,
              },
            });
          }
        } catch (parseError) {
          console.error(`  - Could not parse JSON in file: ${fullPath}`, parseError.message);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }
  return entries;
}

/**
 * Main function to generate and save the puzzle manifest.
 */
async function generateManifest() {
  console.log('🔍 Starting puzzle scan...');
  const puzzleEntries = await scanDirectoryForPuzzles(PUZZLES_DIR);

  if (puzzleEntries.length === 0) {
    console.warn('⚠️ No puzzles found. The manifest will be empty.');
  } else {
    // Sort entries for consistency, e.g., by path
    puzzleEntries.sort((a, b) => a.path.localeCompare(b.path));
  }
  
  try {
    await fs.writeFile(MANIFEST_OUTPUT_PATH, JSON.stringify(puzzleEntries, null, 2));
    console.log(`✅ Success! Manifest generated with ${puzzleEntries.length} puzzles.`);
    console.log(`   Saved to: ${MANIFEST_OUTPUT_PATH}`);
  } catch (err) {
    console.error('❌ Error writing manifest file:', err);
  }
}

// Run the script
generateManifest();