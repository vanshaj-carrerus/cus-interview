"use client";

import React, { useState, useEffect } from "react";
import LanguageSelector from "./components/LanguageSelector";
import CompilerEditor from "./components/CompilerEditor";
import CustomInput from "./components/CustomInput";
import OutputConsole from "./components/OutputConsole";
import { CODE_SNIPPETS, LANGUAGE_IDS } from "./lib/constants";
import { Play, Code } from "lucide-react";

export default function CompilerPage() {
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(CODE_SNIPPETS.javascript);
  const [customInput, setCustomInput] = useState<string>("");
  
  const [outputDetails, setOutputDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("question");
      if (q) setQuestionText(q);
    }

    const savedLang = localStorage.getItem("cus_compiler_lang");
    const savedCode = localStorage.getItem("cus_compiler_code");
    
    if (savedLang && Object.keys(CODE_SNIPPETS).includes(savedLang)) {
      setLanguage(savedLang);
      if (savedCode) {
        setCode(savedCode);
      } else {
        setCode(CODE_SNIPPETS[savedLang as keyof typeof CODE_SNIPPETS]);
      }
    }
  }, []);

  // Save to localStorage when language or code changes
  useEffect(() => {
    localStorage.setItem("cus_compiler_lang", language);
    localStorage.setItem("cus_compiler_code", code);
  }, [language, code]);

  const onSelectLanguage = (lang: string) => {
    setLanguage(lang);
    setCode(CODE_SNIPPETS[lang as keyof typeof CODE_SNIPPETS]);
  };

  const handleCompile = async () => {
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
      
      const data = await response.json();
      
      if (data.error) {
        setIsError(true);
        setOutputDetails({
          stderr: typeof data.error === "string" ? data.error : JSON.stringify(data.error),
          status: data.status || { id: 13, description: "Internal Error" }
        });
      } else if (data.message) {
        // Handle RapidAPI specific error payloads
        setIsError(true);
        setOutputDetails({
          stderr: typeof data.message === "string" ? data.message : JSON.stringify(data.message),
          status: { id: 13, description: "API Error" }
        });
      } else {
        // Output from Piston API is already plain text
        setOutputDetails(data);
        if (data.status?.id !== 3) {
          setIsError(true);
        }
      }
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setOutputDetails({
        stderr: "An error occurred while connecting to the compiler service.",
        status: { id: 13, description: "Network Error" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8fafc] mt-5 text-slate-800 p-4 md:p-6 font-sans flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col gap-4">
        
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100">
              <Code className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Code Playground</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-0.5">Write, compile, and run code instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector language={language} onSelect={onSelectLanguage} />
            <button
              onClick={handleCompile}
              disabled={isLoading}
              className="flex items-center gap-2 bg-slate-900 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              {isLoading ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-4 flex-1 min-h-[600px]">
          
          {/* Editor Area */}
          <div className="flex flex-col gap-5 h-[60vh] lg:h-auto">
            {questionText && (
              <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100 shadow-sm text-slate-800 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />
                <h2 className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-2">Problem Statement</h2>
                <p className="text-sm leading-relaxed text-slate-700">{questionText}</p>
              </div>
            )}
            <div className="flex flex-col rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex-1 relative group">
              {/* Subtle inner shadow top for editor depth */}
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-10" />
              <CompilerEditor language={language} code={code} onChange={(val) => setCode(val || "")} />
            </div>
          </div>

          {/* Right Sidebar (Input/Output) */}
          <div className="flex flex-col gap-4 h-[80vh] lg:h-auto">
            
            {/* Custom Input */}
            <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[200px]">
              <CustomInput customInput={customInput} setCustomInput={setCustomInput} />
            </div>

            {/* Console Output */}
            <div className="flex-[2] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
              <OutputConsole isError={isError} outputDetails={outputDetails} isLoading={isLoading} />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
