import { readFileSync } from "fs";
import { config } from "dotenv";

config({ path: ".env" });

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/test-resume-extract.mjs <pdf-or-docx-path>");
  process.exit(1);
}

const buffer = readFileSync(filePath);
const ext = filePath.split(".").pop()?.toLowerCase();

async function testPdfParse() {
  try {
    const mod = await import("pdf-parse");
    const pdfParse = mod.default ?? mod;
    const data = await pdfParse(buffer);
    console.log("pdf-parse v1 text length:", (data.text ?? "").trim().length);
    console.log("preview:", (data.text ?? "").trim().slice(0, 200));
  } catch (e) {
    console.error("pdf-parse v1 failed:", e.message);
  }
}

async function testGemini() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("No GEMINI_API_KEY");
    return;
  }
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  for (const modelName of ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: ext === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            data: buffer.toString("base64"),
          },
        },
        { text: "Extract all text from this resume. Return plain text only." },
      ]);
      const text = result.response.text().trim();
      console.log(`${modelName} length:`, text.length);
      console.log(`${modelName} preview:`, text.slice(0, 200));
    } catch (e) {
      console.error(`${modelName} failed:`, e.message);
    }
  }
}

async function testMammoth() {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.default.extractRawText({ buffer });
    console.log("mammoth length:", result.value.trim().length);
    console.log("mammoth preview:", result.value.trim().slice(0, 200));
  } catch (e) {
    console.error("mammoth failed:", e.message);
  }
}

if (ext === "pdf") {
  await testPdfParse();
  await testGemini();
} else if (ext === "docx") {
  await testMammoth();
  await testGemini();
}
