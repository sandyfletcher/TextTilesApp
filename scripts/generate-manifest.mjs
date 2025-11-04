import fs from 'fs/promises';
import path from 'path';

const PUZZLES_DIR = './assets/puzzles';
const MANIFEST_OUTPUT_PATH = './assets/puzzles/puzzles.json';


async function scanDirectoryForPuzzles(dirPath) {
  const entries = [];
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        const nestedEntries = await scanDirectoryForPuzzles(fullPath);
        entries.push(...nestedEntries);
      } else if (path.extname(file.name).toLowerCase() === '.json' && file.name !== 'puzzles.json') {
        try {
          const fileContent = await fs.readFile(fullPath, 'utf8');
          const puzzleData = JSON.parse(fileContent);
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
async function generateManifest() {
  console.log('🔍 Starting puzzle scan...');
  const puzzleEntries = await scanDirectoryForPuzzles(PUZZLES_DIR);
  if (puzzleEntries.length === 0) {
    console.warn('⚠️ No puzzles found. The manifest will be empty.');
  } else {
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
generateManifest();