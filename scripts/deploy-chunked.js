const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(path.join(__dirname, '../dist'), {
  dotfiles: true,
  nojekyll: true,
  history: false,
  // This option helps with large deployments
  add: true,
  message: 'Auto-generated commit'
}, (err) => {
  if (err) {
    console.error('Deployment failed:', err);
    process.exit(1);
  }
  console.log('✅ Deployed successfully!');
});