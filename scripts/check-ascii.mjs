import fs from 'fs';
import path from 'path';

let hasErrors = false;
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.json'];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, lineIdx) => {
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const code = line.charCodeAt(charIdx);
      if (code > 127) {
        hasErrors = true;
        const hex = 'U+' + code.toString(16).toUpperCase().padStart(4, '0');
        console.error(
          `Non-ASCII char ${hex} ('${line[charIdx]}') found in ${filePath}:${lineIdx + 1}:${charIdx + 1}`
        );
      }
    }
  });
}

function scanDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        scanDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

console.log('Scanning src/ and index.html for non-ASCII characters...');
scanDir('src');
if (fs.existsSync('index.html')) {
  scanFile('index.html');
}

if (hasErrors) {
  console.error('\nFAIL: Non-ASCII characters detected. Use \\uXXXX escapes or HTML entities.');
  process.exit(1);
} else {
  console.log('PASS: All scanned files contain strictly ASCII characters (<= U+007F).');
  process.exit(0);
}

