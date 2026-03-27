const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const includeDirs = ['src', 'scripts', 'tests'];
const filesToCheck = [];

function collectJsFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectJsFiles(fullPath);
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.js')) {
      filesToCheck.push(fullPath);
    }
  }
}

for (const relDir of includeDirs) {
  collectJsFiles(path.join(repoRoot, relDir));
}

if (filesToCheck.length === 0) {
  console.log('No JS files found for lint check.');
  process.exit(0);
}

let hasErrors = false;

for (const filePath of filesToCheck) {
  const result = spawnSync(process.execPath, ['--check', filePath], {
    stdio: 'pipe',
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    hasErrors = true;
    const relativePath = path.relative(repoRoot, filePath);
    console.error(`\nSyntax error in ${relativePath}`);
    if (result.stderr) {
      console.error(result.stderr.trim());
    }
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`Syntax lint passed (${filesToCheck.length} files checked).`);
