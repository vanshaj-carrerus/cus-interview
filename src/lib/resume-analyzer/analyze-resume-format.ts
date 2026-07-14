import { FORMATTING_LABELS } from "@/lib/resume-analyzer/constants";
import type { FormatCheck } from "@/lib/resume-analyzer/types";
import type { ResumeFileKind } from "@/lib/resume-analyzer/extract-resume-text";

const SECTION_TITLE_RE =
  /^(professional\s+summary|summary|profile|objective|about\s+me|experience|work\s+experience|employment|education|skills|technical\s+skills|projects|personal\s+projects|certifications|certificates|achievements|awards|languages|interests|hobbies|contact|references)$/i;

const BULLET_RE = /^[\s]*(?:[•●○▪▸►‣◉◆◇\-–—*·]|\d+[.)])\s+\S/;
const DATE_RE =
  /\b(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[a-z]*\.?\s+\d{4}|\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}|\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now)|(?:20\d{2}|19\d{2})\s*[-–—]\s*(?:20\d{2}|19\d{2}|present|current|now))\b/gi;
const EMAIL_RE = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}/;
const EMOJI_OR_ICON_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]|☑|✓|✔|★|☆|◆|❖|➤|➜|→|←|↑|↓/u;
const TABLE_HINT_RE = /\|.+\||\t.+\t| {3,}\S+ {3,}\S+/;
const PAGE_FOOTER_RE = /^(page\s+\d+(\s+of\s+\d+)?|\d+\s*\/\s*\d+)$/i;

function nonEmptyLines(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .filter((line) => line.trim().length > 0);
}

function allLines(text: string): string[] {
  return text.replace(/\r\n/g, "\n").split("\n");
}

function hasSectionTitles(lines: string[]): boolean {
  let count = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 40) continue;
    if (SECTION_TITLE_RE.test(trimmed.replace(/[:|]+$/g, "").trim())) {
      count += 1;
    }
  }
  return count >= 3;
}

function hasConsistentBullets(lines: string[]): boolean {
  const bullets = lines.filter((line) => BULLET_RE.test(line));
  if (bullets.length < 2) return false;

  const markers = bullets.map((line) => {
    const match = line.trim().match(/^([•●○▪▸►‣◉◆◇\-–—*·]|\d+[.)])/);
    return match?.[1] ?? "";
  });
  const unique = new Set(markers.filter(Boolean));
  return unique.size <= 2;
}

function hasConsistentDates(text: string): boolean {
  const dates = text.match(DATE_RE) ?? [];
  if (dates.length < 2) return dates.length >= 1;

  const styles = dates.map((date) => {
    const value = date.toLowerCase();
    if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(value)) {
      return "month-year";
    }
    if (/\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}/.test(value)) {
      return "numeric";
    }
    return "year-range";
  });

  const dominant = styles.reduce(
    (best, style) => {
      const count = styles.filter((item) => item === style).length;
      return count > best.count ? { style, count } : best;
    },
    { style: styles[0], count: 0 }
  );

  return dominant.count / styles.length >= 0.6;
}

function looksMultiColumn(lines: string[]): boolean {
  const shortPacked = lines.filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 &&
      trimmed.length <= 28 &&
      / {2,}|\t|\|/.test(line)
    );
  }).length;

  const pipeRows = lines.filter((line) => (line.match(/\|/g) ?? []).length >= 2)
    .length;

  return shortPacked >= 8 || pipeRows >= 3;
}

function looksLikeTables(lines: string[]): boolean {
  const tableLines = lines.filter((line) => TABLE_HINT_RE.test(line)).length;
  return tableLines >= 3;
}

function hasContactHeader(lines: string[]): boolean {
  const head = lines.slice(0, 8).join("\n");
  return EMAIL_RE.test(head) || PHONE_RE.test(head);
}

function hasPageFooters(lines: string[]): boolean {
  const tail = lines.slice(-6);
  return tail.some((line) => PAGE_FOOTER_RE.test(line.trim()));
}

/** Detect cramped or chaotic spacing from raw extracted text. */
function analyzeSpacing(text: string): {
  lineSpacingOk: boolean;
  whiteSpaceOk: boolean;
  textDensityOk: boolean;
  marginsOk: boolean;
} {
  const raw = allLines(text);
  const filled = nonEmptyLines(text);
  if (filled.length < 8) {
    return {
      lineSpacingOk: false,
      whiteSpaceOk: false,
      textDensityOk: false,
      marginsOk: false,
    };
  }

  let blankRuns = 0;
  let longBlankRuns = 0;
  let currentBlank = 0;
  for (const line of raw) {
    if (!line.trim()) {
      currentBlank += 1;
    } else if (currentBlank > 0) {
      blankRuns += 1;
      if (currentBlank >= 4) longBlankRuns += 1;
      currentBlank = 0;
    }
  }

  const blankRatio =
    raw.length > 0
      ? raw.filter((line) => !line.trim()).length / raw.length
      : 0;

  const lengths = filled.map((line) => line.trim().length);
  const avgLen =
    lengths.reduce((sum, length) => sum + length, 0) / Math.max(lengths.length, 1);
  const veryLong = lengths.filter((length) => length > 110).length;
  const veryShort = lengths.filter((length) => length > 0 && length < 12).length;

  // Good resumes have some blank lines between sections, not huge gaps or zero gaps.
  const lineSpacingOk =
    blankRuns >= Math.max(2, Math.floor(filled.length / 18)) &&
    longBlankRuns <= 2 &&
    blankRatio <= 0.45;

  const whiteSpaceOk = blankRatio >= 0.05 && blankRatio <= 0.4 && longBlankRuns <= 2;

  const textDensityOk =
    avgLen >= 28 &&
    avgLen <= 95 &&
    veryLong / lengths.length <= 0.25 &&
    veryShort / lengths.length <= 0.45;

  // Proxy for margins: lines should not be extremely long walls of text.
  const marginsOk = veryLong / lengths.length <= 0.2 && avgLen <= 100;

  return { lineSpacingOk, whiteSpaceOk, textDensityOk, marginsOk };
}

function hasCleanFileStructure(
  lines: string[],
  fileKind: ResumeFileKind
): boolean {
  const text = lines.join("\n").toLowerCase();
  const hasExperience = /experience|employment|work history/.test(text);
  const hasEducation = /education|university|college|bachelor|master|b\.?tech|m\.?tech/.test(
    text
  );
  const hasSkills = /skills|technologies|tech stack|tools/.test(text);
  const readable = lines.length >= 12 && text.replace(/\s+/g, " ").trim().length >= 250;
  const pdfOrDocx = fileKind === "pdf" || fileKind === "docx";
  return pdfOrDocx && readable && hasExperience && hasEducation && hasSkills;
}

function fontConsistencyOk(lines: string[]): boolean {
  const weird = lines.filter((line) =>
    /[\u0300-\u036f]|[Ａ-Ｚａ-ｚ０-９]|[^\S\r\n]{8,}/.test(line)
  ).length;
  const allCapsNoise = lines.filter((line) => {
    const letters = line.replace(/[^A-Za-z]/g, "");
    return letters.length >= 18 && letters === letters.toUpperCase();
  }).length;
  return weird / Math.max(lines.length, 1) <= 0.08 && allCapsNoise <= 6;
}

/**
 * Deterministic format + spacing checks from the uploaded resume text.
 * These feed the formatting checklist (and Formatting section score).
 */
export function analyzeResumeFormat(
  resumeText: string,
  fileKind: ResumeFileKind
): FormatCheck[] {
  const lines = nonEmptyLines(resumeText);
  const spacing = analyzeSpacing(resumeText);
  const multiColumn = looksMultiColumn(lines);
  const tables = looksLikeTables(lines);
  const icons = EMOJI_OR_ICON_RE.test(resumeText);
  const bulletsOk = hasConsistentBullets(lines);
  const sectionsOk = hasSectionTitles(lines);
  const datesOk = hasConsistentDates(resumeText);
  const headerOk = hasContactHeader(lines);
  const footerNoise = hasPageFooters(lines);
  const structureOk = hasCleanFileStructure(lines, fileKind);
  const fontsOk = fontConsistencyOk(lines);

  const byLabel: Record<string, boolean> = {
    "Font Consistency": fontsOk,
    Margins: spacing.marginsOk,
    "Section Titles": sectionsOk,
    "Bullet Points": bulletsOk,
    "Dates Format": datesOk,
    "Icons Usage": !icons, // pass = ATS-safe (no decorative icons)
    Columns: !multiColumn, // pass = single-column ATS-friendly
    Tables: !tables, // pass = no table-heavy layout
    Images: !/(image|photo|picture|img_)/i.test(resumeText.slice(0, 800)),
    Headers: headerOk,
    Footers: !footerNoise, // pass = no page-number footer noise
    "File Structure": structureOk,
    "Line Spacing": spacing.lineSpacingOk,
    "White Space Balance": spacing.whiteSpaceOk,
    "Text Density": spacing.textDensityOk,
  };

  return FORMATTING_LABELS.map((label) => ({
    label,
    passed: byLabel[label] ?? false,
  }));
}

export function formattingChecklistPercent(checks: FormatCheck[]): number {
  if (checks.length === 0) return 0;
  const passed = checks.filter((item) => item.passed).length;
  return Math.round((passed / checks.length) * 100);
}

/** Prefer deterministic results; keep AI only as fallback for unknown labels. */
export function mergeFormattingChecks(
  deterministic: FormatCheck[],
  aiChecks: FormatCheck[] | undefined
): FormatCheck[] {
  const aiMap = new Map(
    (aiChecks ?? []).map((item) => [item.label.toLowerCase(), item.passed])
  );

  return FORMATTING_LABELS.map((label) => {
    const det = deterministic.find(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    );
    if (det) return det;
    return {
      label,
      passed: aiMap.get(label.toLowerCase()) ?? false,
    };
  });
}
