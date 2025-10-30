// This script copies hashed asset files to their expected paths in node_modules
// because Expo Metro exports assets with hash-only filenames, but the JS bundle
// references them by their original paths. When new assets fail to load on the
// deployed site, add their hash mappings to the knownAssets object below.

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const assetsPath = path.join(distPath, 'assets');

console.log('Fixing asset paths...');

// Read all files in assets folder
const files = fs.readdirSync(assetsPath).filter(f => {
  const fullPath = path.join(assetsPath, f);
  return fs.statSync(fullPath).isFile();
});

console.log(`Found ${files.length} asset files`);

// Known hashes from your error messages
const knownAssets = {
  '35ba0eaec5a4f5ed12ca16fabeae451d': {
    type: 'icon',
    path: 'node_modules/@react-navigation/elements/lib/module/assets/back-icon.35ba0eaec5a4f5ed12ca16fabeae451d.png'
  },
  'ca4b48e04dc1ce10bfbddb262c8b835f': {
    type: 'font',
    path: 'node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ca4b48e04dc1ce10bfbddb262c8b835f.ttf'
  }
};

// Copy files based on known hashes
files.forEach(file => {
  if (knownAssets[file]) {
    const asset = knownAssets[file];
    const targetPath = path.join(assetsPath, asset.path);
    const targetDir = path.dirname(targetPath);
    
    fs.mkdirSync(targetDir, { recursive: true });
    
    const src = path.join(assetsPath, file);
    fs.copyFileSync(src, targetPath);
    console.log(`Copied ${asset.type}: ${file} -> ${asset.path}`);
  }
});

// Create a .gitignore inside dist that allows everything
const gitignorePath = path.join(distPath, '.gitignore');
fs.writeFileSync(gitignorePath, '# Allow all files in dist folder\n!*\n');
console.log('Created permissive .gitignore in dist folder');

console.log('Asset fix complete!');