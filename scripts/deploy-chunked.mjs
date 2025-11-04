import ghpages from 'gh-pages';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, '../dist');
const options = {
  dotfiles: true,
  nojekyll: true,
  history: false,
  add: true,
  message: 'Auto-generated commit: deploy to gh-pages'
};
const deploy = async () => {
  try {
    console.log(`🚀 Starting deployment from "${buildPath}" to GitHub Pages...`);
    await ghpages.publish(buildPath, options);
    console.log('✅ Deployment Successful! ✅');
  } catch (err) {
    console.error('❌ Deployment Failed:', err);
    process.exit(1);
  }
};
deploy();