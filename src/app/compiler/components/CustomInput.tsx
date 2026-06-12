import React from "react";
import { TerminalSquare } from "lucide-react";

type Props = {
  customInput: string;
  setCustomInput: (val: string) => void;
};

export default function CustomInput({ customInput, setCustomInput }: Props) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
        <TerminalSquare className="w-4 h-4 text-slate-400" />
        Custom Input (stdin)
      </div>
      <textarea
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Enter your custom input here..."
        className="flex-1 w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white resize-none placeholder:text-slate-400 transition-all shadow-sm inset-ring-slate-100"
      />
    </div>
  );
}
