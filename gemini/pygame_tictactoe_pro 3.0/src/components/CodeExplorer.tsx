import React, { useState } from "react";
import { Copy, Check, Download, FileCode, FolderArchive, Layers } from "lucide-react";
import { PYTHON_FILES, PythonFileItem } from "../data/pythonFiles";

interface CodeExplorerProps {
  onDownloadZip: () => void;
  selectedFileId?: string;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ onDownloadZip, selectedFileId }) => {
  const [activeFile, setActiveFile] = useState<PythonFileItem>(
    PYTHON_FILES.find((f) => f.id === selectedFileId) || PYTHON_FILES[0]
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = activeFile.content.split("\n").length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-400" />
            <span>Python Source Code Repository</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            100% modular, documented Python code implementing every curriculum requirement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download {activeFile.name}</span>
          </button>

          <button
            onClick={onDownloadZip}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-sm shadow-sky-950"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Download All (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Main File Browser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: File List */}
        <div className="lg:col-span-3 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Project Files ({PYTHON_FILES.length})
          </div>

          <div className="space-y-1">
            {PYTHON_FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => {
                  setActiveFile(file);
                  setCopied(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer text-left ${
                  activeFile.id === file.id
                    ? "bg-sky-500/15 border border-sky-500/30 text-sky-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-[10px] text-slate-600 font-mono">
                  {file.language}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Area: Code Viewer */}
        <div className="lg:col-span-9 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
          {/* File Metadata Bar */}
          <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-white">
                  {activeFile.name}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {lineCount} lines · {activeFile.language}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeFile.description}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Topics Covered Bar */}
          <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Layers className="w-3 h-3 text-sky-400" />
              <span>Syllabus Topics in this file:</span>
            </span>
            {activeFile.topicsCovered.map((topic) => (
              <span
                key={topic}
                className="text-[11px] font-medium text-sky-300 bg-sky-950/50 border border-sky-800/50 px-2 py-0.5 rounded-md"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Code Body with Line Numbers */}
          <div className="p-4 bg-slate-950 overflow-x-auto max-h-[580px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>
                {activeFile.content.split("\n").map((line, i) => (
                  <div key={i} className="flex hover:bg-slate-900/60 transition-colors">
                    <span className="w-10 select-none text-slate-600 text-right pr-4 shrink-0">
                      {i + 1}
                    </span>
                    <span className="whitespace-pre">{line || " "}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
