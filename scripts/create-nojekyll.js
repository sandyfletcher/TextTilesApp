const fs = require('fs');
const path = require('path');

// Go up one directory from scripts folder to project root
const nojekyllPath = path.join(__dirname, '..', 'dist', '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('.nojekyll file created successfully');