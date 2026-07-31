import type { jsPDF } from "jspdf";
import type { ImprovedResume } from "@/lib/resume-analyzer/improved-resume-types";

const A4_CAPTURE_WIDTH_PX = 794;
const CAPTURE_SCALE = 1.25;
const JPEG_QUALITY = 0.9;

function findResumeRoot(element: HTMLElement): HTMLElement {
  return (
    element.querySelector<HTMLElement>("[data-resume-pdf-root='true']") ??
    element.querySelector<HTMLElement>("#improved-resume-pdf-root") ??
    element
  );
}

async function waitForFonts(maxWaitMs = 250): Promise<void> {
  await Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, maxWaitMs);
    }),
  ]);
}

async function captureElementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  const captureRoot = findResumeRoot(element);
  const html2canvas = (await import("html2canvas")).default;

  const canvas = await html2canvas(captureRoot, {
    scale: CAPTURE_SCALE,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: A4_CAPTURE_WIDTH_PX,
    windowWidth: A4_CAPTURE_WIDTH_PX,
    scrollX: 0,
    scrollY: 0,
    foreignObjectRendering: false,
    imageTimeout: 0,
    removeContainer: true,
  });

  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    throw new Error("Resume preview could not be rendered.");
  }

  return canvas;
}

async function canvasToPagedPdf(canvas: HTMLCanvasElement, fileName: string): Promise<void> {
  const { jsPDF: JsPdfConstructor } = await import("jspdf");
  const pdf = new JsPdfConstructor({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageHeightPx = (canvas.width * pageHeight) / pageWidth;
  const totalPages = Math.max(1, Math.ceil(canvas.height / pageHeightPx));

  if (totalPages === 1) {
    const imgData = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    const renderHeightMm = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, renderHeightMm, undefined, "FAST");
    pdf.save(fileName);
    return;
  }

  for (let page = 0; page < totalPages; page += 1) {
    if (page > 0) {
      pdf.addPage();
    }

    const sourceY = Math.round(page * pageHeightPx);
    const sliceHeight = Math.min(
      Math.round(pageHeightPx),
      canvas.height - sourceY
    );
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeight;

    const context = sliceCanvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("Could not prepare PDF page.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    context.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight
    );

    const imgData = sliceCanvas.toDataURL("image/jpeg", JPEG_QUALITY);
    const renderHeightMm = (sliceHeight * pageWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, renderHeightMm, undefined, "FAST");
  }

  pdf.save(fileName);
}

/** Captures the styled preview and exports a PDF that matches the on-screen layout. */
export async function downloadImprovedResumePdfFromPreview(
  element: HTMLElement,
  fileName = "improved-resume.pdf"
): Promise<void> {
  if (typeof document === "undefined") {
    throw new Error("PDF export is only available in the browser.");
  }

  await waitForFonts();
  const canvas = await captureElementToCanvas(element);
  await canvasToPagedPdf(canvas, fileName);
}

/** Plain-text fallback only if visual export fails completely. */
export async function downloadImprovedResumePdf(
  resume: ImprovedResume,
  fileName = "improved-resume.pdf"
): Promise<void> {
  const { jsPDF: JsPdfConstructor } = await import("jspdf");
  const doc = new JsPdfConstructor({ unit: "mm", format: "a4" });
  const margin = 14;
  const width = 182;
  let y = 18;

  const addTitle = (text: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 188, 254);
    doc.text(text, margin, y);
    y += 7;
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  const addWrapped = (text: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, width) as string[];
    if (y + lines.length * 5 > 285) {
      doc.addPage();
      y = 18;
    }
    doc.text(lines, margin, y);
    y += lines.length * 5 + 2;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(resume.name, margin, y);
  y += 8;

  doc.setFontSize(12);
  doc.setTextColor(0, 188, 254);
  doc.text(resume.title, margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const contact = [resume.phone, resume.email, resume.location, resume.linkedin, resume.github]
    .filter(Boolean)
    .join(" | ");
  addWrapped(contact);
  y += 2;

  if (resume.summary) {
    addTitle("SUMMARY");
    addWrapped(resume.summary);
    y += 2;
  }

  if (resume.skills.length > 0) {
    addTitle("SKILLS");
    addWrapped(resume.skills.join(", "));
    y += 2;
  }

  if (resume.experience.length > 0) {
    addTitle("EXPERIENCE");
    for (const item of resume.experience) {
      addWrapped(
        `${item.role}${item.company ? ` — ${item.company}` : ""}${item.duration ? ` (${item.duration})` : ""}`,
        true
      );
      for (const bullet of item.bullets) {
        addWrapped(`• ${bullet}`);
      }
      y += 2;
    }
  }

  if (resume.projects.length > 0) {
    addTitle("PROJECTS");
    for (const project of resume.projects) {
      addWrapped(project.name, true);
      if (project.description) addWrapped(project.description);
      if (project.technologies.length > 0) {
        addWrapped(`Tech: ${project.technologies.join(", ")}`);
      }
      for (const bullet of project.bullets) {
        addWrapped(`• ${bullet}`);
      }
      y += 2;
    }
  }

  if (resume.education.length > 0) {
    addTitle("EDUCATION");
    for (const edu of resume.education) {
      addWrapped(
        `${edu.degree}${edu.institution ? ` — ${edu.institution}` : ""}${edu.year ? ` (${edu.year})` : ""}`,
        true
      );
    }
    y += 2;
  }

  if (resume.certifications.length > 0) {
    addTitle("CERTIFICATIONS");
    for (const cert of resume.certifications) {
      addWrapped(`${cert.title}${cert.issuer ? ` — ${cert.issuer}` : ""}`);
    }
    y += 2;
  }

  if (resume.achievements.length > 0) {
    addTitle("KEY ACHIEVEMENTS");
    for (const item of resume.achievements) {
      addWrapped(item.title, true);
      if (item.description) addWrapped(item.description);
    }
    y += 2;
  }

  if (resume.awards.length > 0) {
    addTitle("AWARDS");
    for (const award of resume.awards) {
      addWrapped(`• ${award}`);
    }
  }

  doc.save(fileName);
}
