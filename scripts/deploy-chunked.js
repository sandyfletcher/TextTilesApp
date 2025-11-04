const ghpages = require('gh-pages');
const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '../dist');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.relative(distPath, filePath));
    }
  });
  return arrayOfFiles;
}

async function deployInChunks() {
  try {
    const allFiles = getAllFiles(distPath);
    console.log(`📊 Total files to deploy: ${allFiles.length}`);
    await new Promise((resolve, reject) => {
      ghpages.publish(distPath, {
        dotfiles: true,
        nojekyll: true,
        history: false,
        add: false, // force fresh deployment
        git: 'git', // use system git
        message: `Deploy ${new Date().toISOString()}`,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer to replace default
      }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Deployed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deployInChunks();