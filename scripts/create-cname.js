const fs = require('fs');
const path = require('path');

const cnamePath = path.join(__dirname, '..', 'dist', 'CNAME');
fs.writeFileSync(cnamePath, 'texttiles.sandyfletcher.ca\n');
console.log('CNAME file created successfully');