const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const requiredFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'bin/material.js'
];

console.log(chalk.blue('\n📋 Checking material-cli build output:'));

let buildSuccess = true;

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file);
  try {
    const stats = fs.statSync(filePath);
    console.log(chalk.green(`✅ ${file} (${stats.size} bytes)`));
  } catch (err) {
    console.log(chalk.red(`❌ ${file} not found`));
    buildSuccess = false;
  }
}

if (buildSuccess) {
  console.log(chalk.green('\n🎉 material-cli build completed successfully!\n'));
} else {
  console.log(chalk.red('\n❌ material-cli build failed: some files are missing\n'));
  process.exit(1);
} 