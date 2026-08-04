export function parseProblemPrompt(prompt: string): { title: string; description: string } {
  const trimmed = prompt.trim();
  const colonMatch = trimmed.match(/^([^:]{3,80}):\s*(.+)$/s);
  if (colonMatch) {
    return {
      title: colonMatch[1].trim(),
      description: colonMatch[2].trim(),
    };
  }

  const sentenceEnd = trimmed.search(/[.!?](?:\s+|$)/);
  if (sentenceEnd > 10 && sentenceEnd < 120) {
    const rest = trimmed.slice(sentenceEnd + 1).trim();
    return {
      title: trimmed.slice(0, sentenceEnd + 1).trim(),
      description: rest,
    };
  }

  if (trimmed.length > 72) {
    return { title: `${trimmed.slice(0, 72).trim()}…`, description: "" };
  }

  return { title: trimmed, description: "" };
}

export function formatLevelTitle(title: string, levelNumber: number): string {
  const withoutPrefix = title.replace(new RegExp(`^Level\\s*${levelNumber}\\s*:\\s*`, "i"), "").trim();
  return withoutPrefix || title;
}

export function getQuizModuleLabel(levels = 0): string {
  return `${levels} ${levels === 1 ? "quiz level" : "quiz levels"}`;
}

export function getCourseModuleLabel(levels = 0, questionCount = 0): string {
  if (questionCount > 0 && levels <= 1) {
    return `${questionCount} ${questionCount === 1 ? "problem" : "problems"}`;
  }

  return `${levels} ${levels === 1 ? "module" : "modules"}`;
}
