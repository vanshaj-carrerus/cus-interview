import { readFileSync } from "fs";
import { config } from "dotenv";

config({ path: ".env" });

const key = process.env.MISTRAL_API_KEY;
if (!key) {
  console.error("No MISTRAL_API_KEY");
  process.exit(1);
}

const res = await fetch(
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
);
const buffer = Buffer.from(await res.arrayBuffer());
const base64 = buffer.toString("base64");

const ocrRes = await fetch("https://api.mistral.ai/v1/ocr", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  },
  body: JSON.stringify({
    model: "mistral-ocr-latest",
    document: {
      type: "document_url",
      document_url: `data:application/pdf;base64,${base64}`,
    },
  }),
});

console.log("status:", ocrRes.status);
const data = await ocrRes.json();
if (!ocrRes.ok) {
  console.error(JSON.stringify(data).slice(0, 500));
  process.exit(1);
}

const text = (data.pages ?? []).map((p) => p.markdown ?? "").join("\n");
console.log("length:", text.length);
console.log("text:", text.slice(0, 200));
