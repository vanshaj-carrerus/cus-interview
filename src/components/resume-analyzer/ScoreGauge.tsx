"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { getScoreColor, getScoreLabel } from "@/components/resume-analyzer/utils";

type ScoreGaugeProps = {
  score: number;
  size?: number;
  label?: string;
};

export default function ScoreGauge({
  score,
  size = 220,
  label,
}: ScoreGaugeProps) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);
  const displayLabel = label ?? getScoreLabel(score);

  const spring = useSpring(0, { stiffness: 60, damping: 18 });
  const offset = useTransform(spring, (v) => circumference - (v / 100) * circumference);

  useEffect(() => {
    spring.set(score);
  }, [score, spring]);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(15,23,42,0.06)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold tracking-tight text-slate-900"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span
          className="mt-1 text-sm font-semibold uppercase tracking-[0.2em]"
          style={{ color }}
        >
          {displayLabel}
        </span>
      </div>
    </div>
  );
}
