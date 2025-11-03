import ghpages from 'gh-pages';
import path from 'path';
import { fileURLToPath } from 'url';

// --- ES Module Setup to get __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
// Path to the 'dist' directory created by `npx expo export -p web`
const buildPath = path.join(__dirname, '../dist');

const options = {
  dotfiles: true,
  nojekyll: true,
  history: false, // Keeps the commit history clean by not adding historical commits
  add: true,      // Important for large deployments, stages files before committing
  message: 'Auto-generated commit: deploy to gh-pages'
};

// --- Deployment Logic using async/await ---
const deploy = async () => {
  try {
    console.log(`🚀 Starting deployment from "${buildPath}" to GitHub Pages...`);
    await ghpages.publish(buildPath, options);
    console.log('✅ Deployment to GitHub Pages successful!');
  } catch (err) {
    console.error('❌ Deployment failed:', err);
    process.exit(1);
  }
};

// --- Run the deployment ---
deploy();