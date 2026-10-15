import React from "react";
import { Download, Terminal, Github } from "lucide-react";

interface HeaderProps {
  activeTab: "game" | "code" | "syllabus" | "pyinstaller";
  setActiveTab: (tab: "game" | "code" | "syllabus" | "pyinstaller") => void;
  onDownloadZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onDownloadZip }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white font-mono">
            Pygame Tic-Tac-Toe Pro
          </span>
        </div>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab("game")}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === "game"
                ? "text-sky-400 border-sky-400 font-semibold"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Play Game
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === "code"
                ? "text-sky-400 border-sky-400 font-semibold"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Python Codebase
          </button>
          <button
            onClick={() => setActiveTab("syllabus")}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === "syllabus"
                ? "text-sky-400 border-sky-400 font-semibold"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Syllabus Topics (11)
          </button>
          <button
            onClick={() => setActiveTab("pyinstaller")}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === "pyinstaller"
                ? "text-sky-400 border-sky-400 font-semibold"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            PyInstaller .EXE Guide
          </button>
        </nav>

        {/* Zone 3: Actions + Author GitHub */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://github.com/marzan3015"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            title="Created by @marzan3015 on GitHub"
          >
            <Github className="w-3.5 h-3.5 text-sky-400" />
            <span>@marzan3015</span>
          </a>
          <button
            onClick={onDownloadZip}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-sky-950"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Files</span>
          </button>
        </div>
      </div>
    </header>
  );
};
