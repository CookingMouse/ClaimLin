import React from "react";

interface LogEntry {
  agent: string;
  msg: string;
  status: "success" | "pending" | "error";
}

interface AgentProgressLogProps {
  logs: LogEntry[];
  analyzing: boolean;
  lang: "EN" | "BM";
}

const AgentProgressLog: React.FC<AgentProgressLogProps> = ({
  logs,
  analyzing,
  lang,
}) => {
  if (!analyzing && logs.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 text-slate-300 p-4 rounded-2xl font-mono text-xs flex flex-col gap-2 border border-slate-800 shadow-xl mt-4">
      <div className="flex justify-between items-center text-purple-400 font-bold border-b border-slate-800 pb-2">
        <span>
          {lang === "EN"
            ? "AI AGENT ORCHESTRATION PIPELINE"
            : "SALURAN ORKESTRASI AGEN AI"}
        </span>
        {analyzing && <span className="animate-pulse">Active pipeline...</span>}
      </div>
      <div className="max-h-48 overflow-y-auto flex flex-col gap-3 pt-1">
        {logs.map((log, i) => (
          <div
            key={i}
            className="border-b border-slate-850 pb-2 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-purple-300 font-bold">[{log.agent}]</span>
              {log.status === "success" && (
                <span className="text-emerald-500">✓</span>
              )}
            </div>
            <span className="text-slate-400 block mt-0.5">{log.msg}</span>
          </div>
        ))}
        {analyzing && (
          <div className="flex items-center gap-2 text-slate-500 italic">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentProgressLog;
