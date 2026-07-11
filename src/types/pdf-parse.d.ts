declare module "pdf-parse/lib/pdf-parse.js" {
  type PdfParseResult = {
    text?: string;
    numpages?: number;
    info?: Record<string, unknown>;
  };

  function pdfParse(buffer: Buffer): Promise<PdfParseResult>;
  export = pdfParse;
}
