"use client";

import { useEffect, useState } from "react";

type Phase =
  | "type-heading"
  | "type-paragraph"
  | "pause-full"
  | "delete-paragraph"
  | "delete-heading"
  | "pause-empty";

type Props = {
  heading: string;
  paragraph: string;
  className?: string;
  headingClassName?: string;
  paragraphClassName?: string;
  /** ms per character while typing */
  typeMs?: number;
  /** ms per character while deleting */
  deleteMs?: number;
  /** pause when heading + paragraph are fully shown */
  pauseFullMs?: number;
  /** pause when everything is cleared before retyping */
  pauseEmptyMs?: number;
  showCursor?: boolean;
};

function Cursor() {
  return (
    <span
      className="inline-block w-px h-[0.85em] bg-current align-[-0.05em] ml-0.5 animate-pulse opacity-80"
      aria-hidden
    />
  );
}

export function TypewriterHeadingParagraph({
  heading,
  paragraph,
  className = "",
  headingClassName = "",
  paragraphClassName = "",
  typeMs = 48,
  deleteMs = 28,
  pauseFullMs = 2000,
  pauseEmptyMs = 500,
  showCursor = true,
}: Props) {
  const hasParagraph = paragraph.length > 0;
  const hLen = heading.length;
  const pLen = paragraph.length;

  const [phase, setPhase] = useState<Phase>("type-heading");
  const [hi, setHi] = useState(0);
  const [pi, setPi] = useState(0);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const arm = (fn: () => void, ms: number) => {
      id = setTimeout(fn, ms);
    };

    if (phase === "type-heading") {
      if (hi < hLen) arm(() => setHi((c) => c + 1), typeMs);
      else arm(() => setPhase(hasParagraph ? "type-paragraph" : "pause-full"), 0);
    } else if (phase === "type-paragraph") {
      if (pi < pLen) arm(() => setPi((c) => c + 1), typeMs);
      else arm(() => setPhase("pause-full"), 0);
    } else if (phase === "pause-full") {
      arm(
        () => setPhase(hasParagraph ? "delete-paragraph" : "delete-heading"),
        pauseFullMs,
      );
    } else if (phase === "delete-paragraph") {
      if (pi > 0) arm(() => setPi((c) => c - 1), deleteMs);
      else arm(() => setPhase("delete-heading"), 0);
    } else if (phase === "delete-heading") {
      if (hi > 0) arm(() => setHi((c) => c - 1), deleteMs);
      else arm(() => setPhase("pause-empty"), 0);
    } else if (phase === "pause-empty") {
      arm(() => setPhase("type-heading"), pauseEmptyMs);
    }

    return () => clearTimeout(id);
  }, [
    phase,
    hi,
    pi,
    hLen,
    pLen,
    hasParagraph,
    typeMs,
    deleteMs,
    pauseFullMs,
    pauseEmptyMs,
  ]);

  const hText = heading.slice(0, hi);
  const pText = paragraph.slice(0, pi);

  const headingCursor =
    showCursor && (phase === "type-heading" || phase === "delete-heading");
  const paragraphCursor =
    showCursor && (phase === "type-paragraph" || phase === "delete-paragraph");

  const a11yLabel = hasParagraph ? `${heading}. ${paragraph}` : heading;

  return (
    <div className={className} aria-label={a11yLabel}>
      <div className={headingClassName}>
        {hText}
        {headingCursor ? <Cursor /> : null}
      </div>
      {hasParagraph ? (
        <p className={paragraphClassName}>
          {pText}
          {paragraphCursor ? <Cursor /> : null}
        </p>
      ) : null}
    </div>
  );
}
