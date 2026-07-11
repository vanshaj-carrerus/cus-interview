const EMAIL_REGEX = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g;
const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}(?:[\s.-]?\d{2,5})?/g;

export type DeterministicFields = {
  email: string;
  phone: string;
  guessedName: string;
};

export function extractDeterministicFields(text: string): DeterministicFields {
  const emails = text.match(EMAIL_REGEX) ?? [];
  const phones = text.match(PHONE_REGEX) ?? [];

  return {
    email: emails[0]?.trim() ?? "",
    phone: phones[0]?.trim() ?? "",
    guessedName: guessNameFromText(text),
  };
}

function guessNameFromText(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 8)) {
    if (line.includes("@")) continue;
    if (/^(resume|curriculum vitae|cv|profile)$/i.test(line)) continue;
    if (line.length < 3 || line.length > 70) continue;
    if (/^[\d\s+().-]+$/.test(line)) continue;
    if (/^[A-Za-z][A-Za-z\s.'-]{1,68}[A-Za-z.]$/.test(line)) {
      return line;
    }
  }

  return "";
}

export function textContains(source: string, term: string): boolean {
  const normalizedTerm = term.trim().toLowerCase();
  if (!normalizedTerm) return false;
  return source.toLowerCase().includes(normalizedTerm);
}

/** Keep items that literally appear in the resume text. */
export function filterStringsInSource(
  items: string[],
  sourceText: string
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    if (textContains(sourceText, trimmed)) {
      seen.add(key);
      result.push(trimmed);
    }
  }

  return result;
}

/** Keep project lines when enough words from the label appear in the resume. */
export function filterProjectsInSource(
  projects: string[],
  sourceText: string
): string[] {
  const sourceLower = sourceText.toLowerCase();

  return projects.filter((project) => {
    const trimmed = project.trim();
    if (!trimmed) return false;
    if (textContains(sourceText, trimmed)) return true;

    const words = trimmed
      .toLowerCase()
      .split(/[\s/|,()-]+/)
      .filter((w) => w.length > 3);

    if (words.length === 0) return false;

    const matchedWords = words.filter((word) => sourceLower.includes(word));
    return matchedWords.length >= Math.min(2, words.length);
  });
}

/** Missing keywords must not already appear in the resume. */
export function filterMissingKeywords(
  keywords: string[],
  sourceText: string
): string[] {
  const seen = new Set<string>();

  return keywords.filter((keyword) => {
    const trimmed = keyword.trim();
    if (!trimmed) return false;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return false;
    if (textContains(sourceText, trimmed)) return false;
    seen.add(key);
    return true;
  });
}

export function pickFirstNonEmpty(...values: (string | null | undefined)[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}
