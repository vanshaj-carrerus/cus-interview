"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { PROCESSING_STEPS } from "@/lib/resume-analyzer/constants";

type ProcessingAnimationProps = {
  activeStep: number;
  fileName?: string;
};

export default function ProcessingAnimation({
  activeStep,
  fileName,
}: ProcessingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-xl rounded-[20px] border border-white/60 bg-white/70 p-8 shadow-[0_24px_80px_-24px_rgba(0,188,254,0.18)] backdrop-blur-xl"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00bcfe]/10">
          <Loader2 className="h-8 w-8 animate-spin text-[#00bcfe]" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
          Analyzing your resume
        </h3>
        {fileName ? (
          <p className="mt-2 truncate text-sm text-slate-500">{fileName}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        {PROCESSING_STEPS.map((step, index) => {
          const done = index < activeStep;
          const current = index === activeStep;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                current
                  ? "border-[#00bcfe]/20 bg-[#00bcfe]/5"
                  : done
                    ? "border-[#00bcfe]/20 bg-[#00bcfe]/10"
                    : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  done
                    ? "bg-[#00bcfe] text-white"
                    : current
                      ? "bg-[#00bcfe] text-white"
                      : "bg-slate-200 text-slate-400"
                }`}
              >
                {done ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : current ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Step {index + 1}
                </p>
                <p
                  className={`text-sm font-medium ${
                    current || done ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
