export type FormatCheck = {
  label: string;
  passed: boolean;
};

export type SectionScore = {
  label: string;
  score: number;
};

export type ResumeAnalysisReport = {
  atsScore: number;
  scoreLabel: string;
  interviewSuccess: number;
  candidate: {
    name: string;
    email: string;
    phone: string;
    experience: string;
    education: string;
    skills: string[];
    projects: string[];
    certifications: string[];
  };
  compatibility: { label: string; passed: boolean }[];
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordMatchPercent: number;
  formatting: FormatCheck[];
  grammar: {
    grammarMistakes: number;
    spellingMistakes: number;
    repeatedWords: number;
    weakActionVerbs: number;
    longSentences: number;
    passiveVoice: number;
  };
  suggestions: string[];
  sectionScores: SectionScore[];
  strengths: string[];
  improvements: string[];
  recommendation: string;
};

export type RawAiResumeAnalysis = Omit<ResumeAnalysisReport, "scoreLabel">;
