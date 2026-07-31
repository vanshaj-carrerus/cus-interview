import type { jsPDF } from "jspdf";
import type { ResumeAnalysisReport } from "@/lib/resume-analyzer/types";

const MARGIN = 16;
const LINE_HEIGHT = 6;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize = 10
): number {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * LINE_HEIGHT;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 188, 254);
  doc.text(title, MARGIN, y);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  return y + LINE_HEIGHT + 2;
}

function ensureSpace(doc: jsPDF, y: number, needed = 20): number {
  if (y + needed > 285) {
    doc.addPage();
    return MARGIN + 8;
  }
  return y;
}

export async function downloadResumeReportPdf(
  report: ResumeAnalysisReport,
  fileName?: string
): Promise<void> {
  const { jsPDF: JsPdfConstructor } = await import("jspdf");
  const doc = new JsPdfConstructor({ unit: "mm", format: "a4" });
  let y = MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(0, 188, 254);
  doc.text("ATS Resume Analysis Report", MARGIN, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  if (fileName) {
    doc.text(`File: ${fileName}`, MARGIN, y);
    y += LINE_HEIGHT;
  }
  doc.text(`Generated: ${new Date().toLocaleString()}`, MARGIN, y);
  y += LINE_HEIGHT + 4;

  doc.setTextColor(30, 41, 59);
  y = addSectionTitle(doc, "Overall Score", y);
  y = addWrappedText(
    doc,
    `ATS Score: ${report.atsScore}/100 (${report.scoreLabel})`,
    MARGIN,
    y,
    CONTENT_WIDTH
  );
  y = addWrappedText(
    doc,
    `Interview Success Estimate: ${report.interviewSuccess}%`,
    MARGIN,
    y + 2,
    CONTENT_WIDTH
  );
  y += 6;

  y = ensureSpace(doc, y);
  y = addSectionTitle(doc, "Candidate Summary", y);
  const summaryLines = [
    report.candidate.name && `Name: ${report.candidate.name}`,
    report.candidate.email && `Email: ${report.candidate.email}`,
    report.candidate.phone && `Phone: ${report.candidate.phone}`,
    report.candidate.experience && `Experience: ${report.candidate.experience}`,
    report.candidate.education && `Education: ${report.candidate.education}`,
    report.candidate.skills.length > 0 &&
      `Skills: ${report.candidate.skills.join(", ")}`,
    report.candidate.projects.length > 0 &&
      `Projects: ${report.candidate.projects.join(", ")}`,
  ].filter(Boolean) as string[];

  for (const line of summaryLines) {
    y = ensureSpace(doc, y);
    y = addWrappedText(doc, line, MARGIN, y, CONTENT_WIDTH);
    y += 2;
  }

  y = ensureSpace(doc, y, 24);
  y = addSectionTitle(doc, "Keyword Analysis", y);
  y = addWrappedText(
    doc,
    `Keyword Match: ${report.keywordMatchPercent}%`,
    MARGIN,
    y,
    CONTENT_WIDTH
  );
  y += 2;
  if (report.matchedKeywords.length > 0) {
    y = addWrappedText(
      doc,
      `Matched: ${report.matchedKeywords.join(", ")}`,
      MARGIN,
      y,
      CONTENT_WIDTH
    );
    y += 2;
  }
  if (report.missingKeywords.length > 0) {
    y = ensureSpace(doc, y);
    y = addWrappedText(
      doc,
      `Missing: ${report.missingKeywords.join(", ")}`,
      MARGIN,
      y,
      CONTENT_WIDTH
    );
    y += 4;
  }

  y = ensureSpace(doc, y, 24);
  y = addSectionTitle(doc, "Section Scores", y);
  for (const section of report.sectionScores) {
    y = ensureSpace(doc, y);
    y = addWrappedText(
      doc,
      `${section.label}: ${section.score}%`,
      MARGIN,
      y,
      CONTENT_WIDTH
    );
    y += 2;
  }

  const listSections: { title: string; items: string[] }[] = [
    { title: "Strengths", items: report.strengths },
    { title: "Needs Improvement", items: report.improvements },
    { title: "AI Suggestions", items: report.suggestions },
  ];

  for (const section of listSections) {
    if (section.items.length === 0) continue;
    y = ensureSpace(doc, y, 24);
    y = addSectionTitle(doc, section.title, y);
    for (const item of section.items) {
      y = ensureSpace(doc, y);
      y = addWrappedText(doc, `• ${item}`, MARGIN, y, CONTENT_WIDTH);
      y += 2;
    }
  }

  y = ensureSpace(doc, y, 24);
  y = addSectionTitle(doc, "Final Recommendation", y);
  addWrappedText(doc, report.recommendation, MARGIN, y, CONTENT_WIDTH);

  const baseName = fileName?.replace(/\.[^.]+$/, "") ?? "resume";
  doc.save(`${baseName}-ats-report.pdf`);
}

export function downloadResumeText(content: string, fileName: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".txt") ? fileName : `${fileName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
