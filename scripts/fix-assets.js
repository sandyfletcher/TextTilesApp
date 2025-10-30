const fs = require('fs');
const path = require('path');

// This script creates symlinks/copies for assets that are referenced by original paths
// but are actually exported with hash names

const distPath = path.join(__dirname, '..', 'dist');
const assetsPath = path.join(distPath, 'assets');

// Create the node_modules directory structure that the app expects
const targetDirs = [
  'node_modules/@react-navigation/elements/lib/module/assets',
  'node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts'
];

targetDirs.forEach(dir => {
  const fullPath = path.join(assetsPath, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`Created directory: ${dir}`);
});

// Now we need to find the hashed files and copy them to the expected locations
// Look for back-icon in the assets folder
const files = fs.readdirSync(assetsPath);

// Copy back-icon
const backIcon = files.find(f => f.startsWith('back-icon') || f.includes('35ba0eaec5a4f5ed12ca16fabeae451d'));
if (backIcon) {
  const src = path.join(assetsPath, backIcon);
  const dest = path.join(assetsPath, 'node_modules/@react-navigation/elements/lib/module/assets', backIcon);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${backIcon}`);
}

// Copy Feather font
const featherFont = files.find(f => f.includes('Feather') || f.includes('ca4b48e04dc1ce10bfbddb262c8b835f'));
if (featherFont) {
  const src = path.join(assetsPath, featherFont);
  const dest = path.join(assetsPath, 'node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts', featherFont);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${featherFont}`);
}

console.log('Asset fix complete!');