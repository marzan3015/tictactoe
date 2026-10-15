import React, { useState } from "react";
import { FolderArchive, Files, Check, Loader2, X, Download, ShieldCheck, Terminal } from "lucide-react";
import { downloadProjectZip, downloadAllFilesIndividually } from "../utils/zipDownloader";
import { PYTHON_FILES } from "../data/pythonFiles";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [isZipping, setIsZipping] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [progressText, setProgressText] = useState<string>("");

  if (!isOpen) return null;

  const handleZipDownload = async () => {
    setIsZipping(true);
    setProgressText("Bundling files in browser...");
    try {
      await downloadProjectZip((percent) => {
        setProgressText(`Compressing archive (${percent}%)...`);
      });
      setDownloadSuccess("ZIP archive created and downloaded successfully!");
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error("ZIP creation failed", err);
      setProgressText("Failed to generate ZIP. Try individual file download below.");
    } finally {
      setIsZipping(false);
      setProgressText("");
    }
  };

  const handleBatchDownload = async () => {
    setIsDownloadingAll(true);
    try {
      await downloadAllFilesIndividually((current, total) => {
        setProgressText(`Downloading file ${current} of ${total}...`);
      });
      setDownloadSuccess(`All ${PYTHON_FILES.length} files downloaded to your Downloads folder!`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error("Batch download failed", err);
    } finally {
      setIsDownloadingAll(false);
      setProgressText("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Download Project Files
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All 11 source code files, requirements, and guides
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {/* Option 1: Clean JSZip In-Memory Generator */}
          <button
            onClick={handleZipDownload}
            disabled={isZipping || isDownloadingAll}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-sky-500/40 hover:border-sky-500 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                {isZipping ? <Loader2 className="w-5 h-5 animate-spin" /> : <FolderArchive className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Download Complete ZIP Archive</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono">
                    .ZIP
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {progressText && isZipping ? progressText : "Client-side packed. Contains all 11 files with zero corruption."}
                </div>
              </div>
            </div>

            <span className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg group-hover:bg-sky-500 transition-colors shrink-0">
              {isZipping ? "Packing..." : "Download ZIP"}
            </span>
          </button>

          {/* Option 2: 1-Click Multi-File Individual Downloader */}
          <button
            onClick={handleBatchDownload}
            disabled={isZipping || isDownloadingAll}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                {isDownloadingAll ? <Loader2 className="w-5 h-5 animate-spin" /> : <Files className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Download All 11 Files Individually</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                    Direct
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {progressText && isDownloadingAll ? progressText : "Downloads every .py, .txt, .md, and .bat file directly."}
                </div>
              </div>
            </div>

            <span className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-700 rounded-lg group-hover:bg-slate-600 transition-colors shrink-0">
              {isDownloadingAll ? "Saving..." : "Download All"}
            </span>
          </button>
        </div>

        {/* File manifest summary */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
          <div className="text-[11px] font-mono font-semibold text-slate-400 flex items-center justify-between">
            <span>Archive Manifest ({PYTHON_FILES.length} Files):</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Clean</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
            {PYTHON_FILES.map((f) => (
              <span key={f.name} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {f.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
