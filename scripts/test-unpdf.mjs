import { extractText } from "unpdf";

const res = await fetch(
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
);
const buffer = Buffer.from(await res.arrayBuffer());
const { text, totalPages } = await extractText(new Uint8Array(buffer), {
  mergePages: true,
});
console.log("pages:", totalPages);
console.log("length:", text.length);
console.log("text:", text);
