import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("../node_modules/pdf-parse/lib/pdf-parse.js");

const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 55>>stream
BT /F1 12 Tf 100 700 Td (John Doe React Developer) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
trailer<</Size 6/Root 1 0 R>>
startxref
400
%%EOF`;

writeFileSync("test-resume.pdf", pdf);
const data = await pdfParse(readFileSync("test-resume.pdf"));
console.log("length:", data.text.trim().length);
console.log("text:", data.text.trim());
