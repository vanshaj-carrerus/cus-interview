const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/primary-foreground/g, 'white');
      content = content.replace(/(bg-|text-|border-|ring-|shadow-|from-|to-|fill-|stroke-)primary/g, '$1sky-500');
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'src/components/resume-analyzer'));
processDir(path.join(__dirname, 'src/app/dashboard/resume-analyzer'));
console.log('Replaced Tailwind primary colors with sky-500 in Resume Analyzer components');
