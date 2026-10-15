import React, { useState } from "react";
import { CheckCircle2, ChevronRight, Code2, BookOpen } from "lucide-react";
import { SYLLABUS_TOPICS } from "../data/pythonFiles";

interface SyllabusChecklistProps {
  onSelectFile: (fileId: string) => void;
}

export const SyllabusChecklist: React.FC<SyllabusChecklistProps> = ({ onSelectFile }) => {
  const [selectedTopic, setSelectedTopic] = useState<number>(1);

  const activeTopicData = SYLLABUS_TOPICS.find((t) => t.number === selectedTopic) || SYLLABUS_TOPICS[0];

  const getFileIdFromName = (filename: string) => {
    return filename.replace(".py", "").replace(".txt", "").replace(".md", "");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">
            Curriculum & Academic Syllabus Verification
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Every single programming concept requested has been meticulously integrated into the Pygame codebase.
          Select any topic below to view its architectural rationale, key concepts, and source code snippet.
        </p>
      </div>

      {/* 2-Column Split: Topic List + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topics List */}
        <div className="lg:col-span-5 space-y-2">
          {SYLLABUS_TOPICS.map((topic) => {
            const isSelected = topic.number === selectedTopic;
            return (
              <button
                key={topic.number}
                onClick={() => setSelectedTopic(topic.number)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-sky-500/10 border-sky-500 text-white shadow-md shadow-sky-950/40"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      isSelected
                        ? "bg-sky-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {topic.number}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      {topic.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {topic.primaryFile}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-sky-400 translate-x-0.5" : "text-slate-600"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-[11px] font-mono text-sky-400 font-semibold uppercase tracking-wider">
                Topic #{activeTopicData.number}
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {activeTopicData.title}
              </h3>
            </div>

            <button
              onClick={() => onSelectFile(getFileIdFromName(activeTopicData.primaryFile))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-sky-400 bg-sky-950/60 border border-sky-800/60 rounded-lg hover:bg-sky-900/50 transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Inspect {activeTopicData.primaryFile}</span>
            </button>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-1">
              Architectural Purpose & Implementation
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeTopicData.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2">
              Key Syllabus Principles Tested
            </h4>
            <ul className="space-y-1.5">
              {activeTopicData.keyConcepts.map((concept, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Code Snippet from {activeTopicData.primaryFile}</span>
              <span className="text-[10px] text-slate-500 font-mono">Python 3.10+</span>
            </h4>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                <code>{activeTopicData.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
