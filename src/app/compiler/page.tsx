"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LanguageSelector from "./components/LanguageSelector";
import CompilerEditor from "./components/CompilerEditor";
import CustomInput from "./components/CustomInput";
import OutputConsole from "./components/OutputConsole";
import { CODE_SNIPPETS, LANGUAGE_IDS } from "./lib/constants";
import {
  getProblemCodeStorageKey,
  getProblemStarterCode,
  loadProblemContextFromQuestionId,
  parseProblemFromSearchParams,
  resolveExpectedOutput,
  resolveProblemValidation,
  getClassSimulationOutput,
  syncProblemSolveToServer,
  type ProblemContext,
} from "./lib/problem-templates";
import { Play, Code } from "lucide-react";
import SubscriptionPaywallModal from "@/components/billing/SubscriptionPaywallModal";
import { useSubscriptionGate } from "@/hooks/use-subscription-gate";

export default function CompilerPage({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const { checkAccess, paywallOpen, closePaywall, openPaywall } =
    useSubscriptionGate();
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(CODE_SNIPPETS.javascript);
  const [customInput, setCustomInput] = useState<string>("");
  const [outputDetails, setOutputDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [problemContext, setProblemContext] = useState<ProblemContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function initializeCompiler() {
      const params = new URLSearchParams(window.location.search);
      const questionId = params.get("questionId");
      const questionText = params.get("question")?.trim() ?? "";

      let parsedProblem: ProblemContext | null = null;

      if (questionText) {
        parsedProblem =
          questionId != null
            ? await loadProblemContextFromQuestionId(questionId, questionText)
            : parseProblemFromSearchParams(params);
      }

      if (cancelled) return;

      setProblemContext(parsedProblem);
      setProgressSaved(false);
      setProgressMessage(null);

      const savedLang = localStorage.getItem("cus_compiler_lang");
      const initialLang =
        savedLang && Object.keys(CODE_SNIPPETS).includes(savedLang)
          ? savedLang
          : "javascript";

      setLanguage(initialLang);

      if (parsedProblem) {
        const storageKey = getProblemCodeStorageKey(
          initialLang,
          parsedProblem.questionId
        );
        const savedCode = localStorage.getItem(storageKey);

        setCode(
          savedCode || getProblemStarterCode(initialLang, parsedProblem.questionText)
        );
        setCustomInput(parsedProblem.sampleInput);
      } else {
        const savedCode = localStorage.getItem("cus_compiler_code");
        setCode(savedCode || CODE_SNIPPETS[initialLang as keyof typeof CODE_SNIPPETS]);
      }

      setIsInitialized(true);
    }

    void initializeCompiler();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("cus_compiler_lang", language);

    if (problemContext) {
      const storageKey = getProblemCodeStorageKey(language, problemContext.questionId);
      localStorage.setItem(storageKey, code);
      return;
    }

    localStorage.setItem("cus_compiler_code", code);
  }, [language, code, problemContext, isInitialized]);

  const onSelectLanguage = (lang: string) => {
    setLanguage(lang);

    if (problemContext) {
      const storageKey = getProblemCodeStorageKey(lang, problemContext.questionId);
      const savedCode = localStorage.getItem(storageKey);
      setCode(
        savedCode || getProblemStarterCode(lang, problemContext.questionText)
      );
      return;
    }

    setCode(CODE_SNIPPETS[lang as keyof typeof CODE_SNIPPETS]);
  };

  const saveProblemProgress = async (questionId: string) => {
    setIsSavingProgress(true);
    setProgressMessage(null);

    const result = await syncProblemSolveToServer(questionId);
    setIsSavingProgress(false);

    if (result.ok) {
      setProgressSaved(true);
      router.refresh();
      setProgressMessage(
        result.alreadySolved
          ? "Already counted on your dashboard."
          : "Progress saved! Your dashboard and practice stats are updated."
      );
      return;
    }

    setProgressMessage(result.error ?? "Could not save progress. Try again.");
  };

  const runCompile = async () => {
    if (!code) return;
    setIsLoading(true);
    setIsError(false);
    setOutputDetails(null);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS],
          stdin: customInput,
        }),
      });

      if (response.status === 403) {
        openPaywall();
        return;
      }

      const data = await response.json();

      if (data.error) {
        setIsError(true);
        setOutputDetails({
          stderr:
            typeof data.error === "string" ? data.error : JSON.stringify(data.error),
          status: data.status || { id: 13, description: "Internal Error" },
        });
      } else if (data.message) {
        setIsError(true);
        setOutputDetails({
          stderr:
            typeof data.message === "string"
              ? data.message
              : JSON.stringify(data.message),
          status: { id: 13, description: "API Error" },
        });
      } else {
        const executionSucceeded = data.status?.id === 3;
        const validationResult = problemContext
          ? resolveProblemValidation(
              data.stdout,
              problemContext,
              executionSucceeded,
              customInput,
              code
            )
          : null;

        const simulatedStdout =
          problemContext && validationResult === "correct" && !(data.stdout ?? "").trim()
            ? getClassSimulationOutput(
                problemContext.questionText,
                code,
                customInput,
                problemContext.sampleInput
              )
            : null;

        const computedExpected = problemContext
          ? resolveExpectedOutput(problemContext, customInput, code)
          : null;

        setOutputDetails({
          ...data,
          stdout: data.stdout || simulatedStdout,
          validationResult,
          computedExpected,
        });

        if (validationResult === "correct" && problemContext?.questionId) {
          void saveProblemProgress(problemContext.questionId);
        }

        if (!executionSucceeded) {
          setIsError(true);
        } else if (validationResult === "wrong") {
          setIsError(true);
        }
      }
    } catch (err: unknown) {
      console.error(err);
      setIsError(true);
      setOutputDetails({
        stderr: "An error occurred while connecting to the compiler service.",
        status: { id: 13, description: "Network Error" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompile = () => {
    checkAccess(() => {
      void runCompile();
    });
  };

  return (
    <div
      className={
        embedded
          ? "flex min-h-0 flex-col bg-[#f8fafc] pt-1 font-sans text-slate-800"
          : "mt-5 flex min-h-[calc(100vh-80px)] flex-col bg-[#f8fafc] p-5 font-sans text-slate-800 md:p-6"
      }
    >
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {!embedded ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 bg-sky-50">
                <Code className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
                  Code Playground
                </h1>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {problemContext
                    ? "Write code for the problem, then run it"
                    : "Write, compile, and run code instantly"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold uppercase tracking-wider text-secondary/45">
              {problemContext ? "Problem mode" : "Code playground"}
            </p>
          )}

          <div className="ml-auto flex items-center gap-4">
            <LanguageSelector language={language} onSelect={onSelectLanguage} />
            <button
              onClick={handleCompile}
              disabled={isLoading}
              className="flex items-center gap-2 bg-slate-900 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              {isLoading
                ? "Running..."
                : problemContext
                  ? "Run & Check"
                  : "Run Code"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-4 flex-1 min-h-[600px]">
          <div className="flex flex-col gap-5 h-[60vh] lg:h-auto">
            {problemContext && (
              <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100 shadow-sm text-slate-800 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />
                <h2 className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-2">
                  Problem Statement
                </h2>
                <p className="text-sm leading-relaxed text-slate-700">
                  {problemContext.questionText}
                </p>
                {problemContext.hasAutoCheck ? (
                  <p className="mt-3 text-xs text-slate-500">
                    You can use the sample input, your own input, or test values in
                    your code. If your logic is correct, the answer will be accepted.
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-amber-600">
                    Auto-check is not available for this problem yet. Write a solution
                    that matches the problem statement.
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex-1 relative group">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-10" />
              <CompilerEditor
                language={language}
                code={code}
                onChange={(val) => setCode(val || "")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 h-[80vh] lg:h-auto">
            <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[200px]">
              <CustomInput customInput={customInput} setCustomInput={setCustomInput} />
            </div>

            <div className="flex-[2] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
              <OutputConsole
                isError={isError}
                outputDetails={outputDetails}
                isLoading={isLoading}
                expectedOutput={problemContext?.expectedOutput}
                isProblemMode={Boolean(problemContext)}
                canMarkSolved={
                  Boolean(problemContext?.questionId) &&
                  outputDetails?.status?.id === 3 &&
                  outputDetails?.validationResult === "unchecked" &&
                  !progressSaved
                }
                isSavingProgress={isSavingProgress}
                progressMessage={progressMessage}
                onMarkSolved={
                  problemContext?.questionId
                    ? () => void saveProblemProgress(problemContext.questionId!)
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>

      <SubscriptionPaywallModal open={paywallOpen} onClose={closePaywall} />
    </div>
  );
}
