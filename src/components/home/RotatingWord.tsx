"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const WORDS = [
  { text: "Hired", color: "text-sky-400", caret: "bg-sky-400" },
  { text: "Placed", color: "text-emerald-400", caret: "bg-emerald-400" },
  { text: "Promoted", color: "text-violet-400", caret: "bg-violet-400" },
  { text: "Noticed", color: "text-amber-400", caret: "bg-amber-400" },
];

const TYPE_MS = 95;
const DELETE_MS = 50;
const HOLD_MS = 1600;
const NEXT_MS = 300;

/* Typewriter: types the word, holds, deletes it, then types the next one */
export default function RotatingWord() {
  const reduceMotion = useReducedMotion();
  const [{ index, length, deleting }, setState] = useState({
    index: 0,
    length: WORDS[0].text.length,
    deleting: false,
  });

  useEffect(() => {
    if (reduceMotion) return;
    const full = WORDS[index].text.length;

    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && length === full) delay = HOLD_MS;
    if (deleting && length === 0) delay = NEXT_MS;

    const id = setTimeout(() => {
      setState((s) => {
        const target = WORDS[s.index].text.length;
        if (!s.deleting && s.length === target) return { ...s, deleting: true };
        if (s.deleting && s.length === 0)
          return { index: (s.index + 1) % WORDS.length, length: 0, deleting: false };
        return { ...s, length: s.length + (s.deleting ? -1 : 1) };
      });
    }, delay);
    return () => clearTimeout(id);
  }, [index, length, deleting, reduceMotion]);

  const word = WORDS[index];

  return (
    <span className="relative inline-flex items-baseline whitespace-nowrap pr-[0.08em]">
      <span className="sr-only">{WORDS[0].text}</span>
      <em className={`italic ${word.color}`} aria-hidden>
        {/* Zero-width space keeps the line height while the word is empty */}
        {word.text.slice(0, length) || "​"}
      </em>
      <span
        className={`ml-[0.06em] inline-block h-[0.8em] w-[0.06em] translate-y-[0.08em] rounded-full ${word.caret} motion-safe:animate-[caret-blink_1s_steps(1)_infinite]`}
        aria-hidden
      />
    </span>
  );
}
