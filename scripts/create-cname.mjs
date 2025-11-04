import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cnamePath = path.join(__dirname, '..', 'dist', 'CNAME');
fs.writeFileSync(cnamePath, 'texttiles.sandyfletcher.ca\n');

console.log('✅ CNAME file created ✅');