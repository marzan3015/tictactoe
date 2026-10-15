import React, { useState } from "react";
import { Github } from "lucide-react";
import { Header } from "./components/Header";
import { GameArena } from "./components/GameArena";
import { CodeExplorer } from "./components/CodeExplorer";
import { SyllabusChecklist } from "./components/SyllabusChecklist";
import { PyInstallerGuide } from "./components/PyInstallerGuide";
import { DownloadModal } from "./components/DownloadModal";

export default function App() {
  const [activeTab, setActiveTab] = useState<"game" | "code" | "syllabus" | "pyinstaller">("game");
  const [selectedFileId, setSelectedFileId] = useState<string>("main");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  const handleOpenDownloadModal = () => {
    setIsDownloadModalOpen(true);
  };

  const handleSelectFileFromSyllabus = (fileId: string) => {
    setSelectedFileId(fileId);
    setActiveTab("code");
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navigation Bar adhering to the Top Bar contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleOpenDownloadModal}
      />

      {/* Main View Port */}
      <main className="flex-1 pb-16">
        {activeTab === "game" && <GameArena />}
        {activeTab === "code" && (
          <CodeExplorer
            onDownloadZip={handleOpenDownloadModal}
            selectedFileId={selectedFileId}
          />
        )}
        {activeTab === "syllabus" && (
          <SyllabusChecklist onSelectFile={handleSelectFileFromSyllabus} />
        )}
        {activeTab === "pyinstaller" && <PyInstallerGuide />}
      </main>

      {/* Download Options Modal (In-Memory JSZip + Batch Multi-File Downloader) */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Clean Unobtrusive Footer with Centered Author Attribution */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-slate-400">
            Pygame Tic-Tac-Toe Pro · Complete Academic Edition
          </div>

          {/* Centered Author Attribution */}
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span>Made by</span>
            <a
              href="https://github.com/marzan3015"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-sky-400 hover:text-sky-300 hover:border-sky-500 transition-all font-mono shadow-sm hover:shadow-sky-500/10"
              title="Visit @marzan3015 on GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span>@marzan3015</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 hover:underline">github.com/marzan3015</span>
            </a>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>Recursive Minimax</span>
            <span>·</span>
            <span>Persistent Leaderboard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
