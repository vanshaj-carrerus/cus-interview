import React from "react";
import { Terminal, Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { ValidationResult } from "../lib/problem-templates";

type OutputDetails = {
  status?: { id: number; description: string };
  compile_output?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  time?: string;
  memory?: number;
  validationResult?: ValidationResult | null;
  computedExpected?: string | null;
};

type Props = {
  isError: boolean;
  outputDetails: OutputDetails | null;
  isLoading: boolean;
  expectedOutput?: string | null;
  isProblemMode?: boolean;
  canMarkSolved?: boolean;
  isSavingProgress?: boolean;
  progressMessage?: string | null;
  onMarkSolved?: () => void;
};

function getProblemStatusBadge(validationResult: ValidationResult | null | undefined) {
  if (validationResult === "correct") {
    return {
      label: "Correct",
      className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
      icon: <CheckCircle2 className="w-3 h-3" />,
    };
  }

  if (validationResult === "wrong") {
    return {
      label: "Wrong Answer",
      className: "bg-rose-500/10 border-rose-500/20 text-rose-600",
      icon: <XCircle className="w-3 h-3" />,
    };
  }

  return {
    label: "Executed",
    className: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    icon: <AlertTriangle className="w-3 h-3" />,
  };
}

export default function OutputConsole({
  isError,
  outputDetails,
  isLoading,
  expectedOutput,
  isProblemMode = false,
  canMarkSolved = false,
  isSavingProgress = false,
  progressMessage = null,
  onMarkSolved,
}: Props) {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;
    
    if (statusId === 6) {
      // Compilation error
      return (
        <span className="text-rose-600">
          {outputDetails?.compile_output || "Compilation Error"}
        </span>
      );
    } else if (statusId === 3) {
      const outputClassName =
        isProblemMode && outputDetails?.validationResult === "wrong"
          ? "text-rose-600"
          : "text-emerald-600";

      return (
        <span className={outputClassName}>
          {outputDetails?.stdout !== null ? outputDetails?.stdout : ""}
        </span>
      );
    } else if (statusId === 5) {
      // Time Limit Exceeded
      return <span className="text-amber-600">Time Limit Exceeded</span>;
    } else {
      // Other errors or stderr
      return (
        <span className="text-rose-600">
          {outputDetails?.stderr || outputDetails?.stdout || "Unknown Error occurred"}
        </span>
      );
    }
  };

  const showExecutionMetrics =
    outputDetails &&
    !isLoading &&
    outputDetails.status?.id === 3 &&
    (!isProblemMode || outputDetails.validationResult === "correct");

  const problemBadge =
    isProblemMode && outputDetails?.status?.id === 3
      ? getProblemStatusBadge(outputDetails.validationResult)
      : null;

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          Console Output
        </div>
        {outputDetails && outputDetails.status && !isLoading && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${
              problemBadge
                ? problemBadge.className
                : outputDetails.status.id === 3
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                  : outputDetails.status.id === 6
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-600"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-600"
            }`}
          >
            {problemBadge ? (
              <>
                {problemBadge.icon}
                {problemBadge.label}
              </>
            ) : (
              <>
                {outputDetails.status.id === 3 ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {outputDetails.status.description}
              </>
            )}
          </div>
        )}
      </div>

      {isProblemMode && !isLoading && outputDetails?.validationResult === "correct" && (
        <div className="rounded-xl border px-4 py-3 text-sm font-semibold border-emerald-200 bg-emerald-50 text-emerald-700">
          Correct! Your answer is correct for this problem.
          {progressMessage ? (
            <p className="mt-1 text-xs font-medium text-emerald-600">{progressMessage}</p>
          ) : null}
        </div>
      )}

      {isProblemMode && !isLoading && outputDetails?.validationResult === "wrong" && (
        <div className="rounded-xl border px-4 py-3 text-sm font-semibold border-rose-200 bg-rose-50 text-rose-700">
          Wrong answer. Your code ran, but the output does not look like a correct
          solution for this problem.
          {(outputDetails?.computedExpected ?? expectedOutput)
            ? ` Expected something like: ${outputDetails?.computedExpected ?? expectedOutput}`
            : ""}
        </div>
      )}

      {isProblemMode && !isLoading && outputDetails?.validationResult === "unchecked" && (
        <div className="rounded-xl border px-4 py-3 text-sm font-semibold border-amber-200 bg-amber-50 text-amber-700">
          Code executed, but this problem cannot be auto-checked yet. Make sure your
          solution matches the problem statement.
          {canMarkSolved && onMarkSolved ? (
            <button
              type="button"
              onClick={onMarkSolved}
              disabled={isSavingProgress}
              className="mt-3 block rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingProgress ? "Saving..." : "Mark as solved"}
            </button>
          ) : null}
          {progressMessage ? (
            <p className="mt-2 text-xs font-medium text-amber-800">{progressMessage}</p>
          ) : null}
        </div>
      )}

      <div className="flex-1 w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-sm font-mono overflow-y-auto shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Executing Code...</span>
          </div>
        ) : outputDetails ? (
          <pre className="whitespace-pre-wrap break-words font-mono">
            {getOutput()}
          </pre>
        ) : (
          <span className="text-slate-400 flex items-center justify-center h-full text-[10px] font-bold uppercase tracking-widest">
            Click "Run Code" to see the output here
          </span>
        )}
      </div>

      {/* Metrics Footer */}
      {showExecutionMetrics && (
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1 px-1">
          <span>Time: <span className="text-slate-800 font-bold">{outputDetails.time || "0"}s</span></span>
          <span>Memory: <span className="text-slate-800 font-bold">{outputDetails.memory || "0"} KB</span></span>
        </div>
      )}
    </div>
  );
}
