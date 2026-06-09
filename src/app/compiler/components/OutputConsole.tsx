import React from "react";
import { Terminal, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

type OutputDetails = {
  status?: { id: number; description: string };
  compile_output?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  time?: string;
  memory?: number;
};

type Props = {
  isError: boolean;
  outputDetails: OutputDetails | null;
  isLoading: boolean;
};

export default function OutputConsole({ isError, outputDetails, isLoading }: Props) {
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
      // Accepted
      return (
        <span className="text-emerald-600">
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

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          Console Output
        </div>
        {outputDetails && outputDetails.status && !isLoading && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${
            outputDetails.status.id === 3 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
            outputDetails.status.id === 6 ? "bg-rose-500/10 border-rose-500/20 text-rose-600" :
            "bg-amber-500/10 border-amber-500/20 text-amber-600"
          }`}>
            {outputDetails.status.id === 3 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {outputDetails.status.description}
          </div>
        )}
      </div>
      
      <div className="flex-1 w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-sm font-mono overflow-y-auto shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
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
      {outputDetails && !isLoading && outputDetails.status?.id === 3 && (
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1 px-1">
          <span>Time: <span className="text-slate-800 font-bold">{outputDetails.time || "0"}s</span></span>
          <span>Memory: <span className="text-slate-800 font-bold">{outputDetails.memory || "0"} KB</span></span>
        </div>
      )}
    </div>
  );
}
