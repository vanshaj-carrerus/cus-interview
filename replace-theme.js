const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src/app/dashboard/ai-mock-interview/ai-mock-setup-step-form.tsx');
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/primary/g, 'sky-500');
fs.writeFileSync(p, content);
console.log('Replaced all primary with sky-500');
