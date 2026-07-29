const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllJsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllJsxFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.jsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const tailwindRegex = /\b(mb-\w+|mt-\w+|my-\w+|mx-\w+|p-\w+|px-\w+|py-\w+|pb-\w+|pt-\w+|flex|items-\w+|justify-\w+|w-\w+|h-\w+|bg-\w+(-\w+)?|text-\w+(-\w+)?|font-\w+|rounded(-\w+)?|shadow(-\w+)?|border(-\w+)?|z-\w+|relative|absolute|fixed|inset-\w+|top-\w+|bottom-\w+|left-\w+|right-\w+|blur(-\w+)?|gap-\w+|overflow-\w+|pointer-events-\w+|transition(-\w+)?|hover:\w+(-\w+)?|decoration-\w+(-\w+)?|underline(-\w+)?|min-h-\w+|max-w-\w+|tracking-\w+|space-\w+|opacity-\w+)\b/g;

function cleanClasses(content) {
  // Regex to find className="something" or className={'something'}
  return content.replace(/className=(["'])(.*?)\1/g, (match, quote, classes) => {
    // Keep custom semantic classes, remove tailwind utilities
    let newClasses = classes.replace(tailwindRegex, '').trim().replace(/\s+/g, ' ');
    if (newClasses === '') return ''; // Remove empty className
    return `className=${quote}${newClasses}${quote}`;
  });
}

function processFiles() {
  const files = getAllJsxFiles(srcDir);
  let updatedCount = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const newContent = cleanClasses(content);
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} files.`);
}

processFiles();
