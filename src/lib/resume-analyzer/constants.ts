export const PROCESSING_STEPS = [
  "Reading Resume...",
  "Extracting Information...",
  "Running ATS Analysis...",
  "Checking Keywords...",
  "Analyzing Formatting...",
  "Calculating ATS Score...",
] as const;

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const COMPATIBILITY_LABELS = [
  "Contact Information",
  "Education",
  "Experience",
  "Skills",
  "Projects",
  "Certifications",
  "Professional Summary",
] as const;

export const FORMATTING_LABELS = [
  "Font Consistency",
  "Margins",
  "Section Titles",
  "Bullet Points",
  "Dates Format",
  "Icons Usage",
  "Columns",
  "Tables",
  "Images",
  "Headers",
  "Footers",
  "File Structure",
  "Line Spacing",
  "White Space Balance",
  "Text Density",
] as const;

export const SECTION_SCORE_LABELS = [
  "Resume Summary",
  "Skills",
  "Projects",
  "Experience",
  "Education",
  "Formatting",
  "Grammar",
] as const;

/** Short resumes are still valid — only reject near-empty files. */
export const MIN_RESUME_TEXT_LENGTH = 10;
