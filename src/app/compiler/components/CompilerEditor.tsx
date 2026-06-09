import React from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

type Props = {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
};

export default function CompilerEditor({ language, code, onChange }: Props) {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      // Define a custom theme if we want, but vs is pretty good out of the box.
      // We can customize the background to match our UI.
      monaco.editor.defineTheme("custom-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#ffffff",
          "editor.lineHighlightBackground": "#f1f5f9",
        },
      });
      monaco.editor.setTheme("custom-light");
    }
  }, [monaco]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-teal-500/5 pointer-events-none" />
      <Editor
        height="100%"
        language={language === "cpp" ? "cpp" : language}
        value={code}
        theme="custom-light"
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
          fontLigatures: true,
          padding: { top: 20 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full text-slate-400 text-sm font-semibold uppercase tracking-widest animate-pulse">
            Loading Editor...
          </div>
        }
      />
    </div>
  );
}
