import React, { useState } from "react";
import { Terminal, Copy, Check, CheckCircle2, AlertTriangle, ShieldCheck, Download, Cpu, PackageCheck } from "lucide-react";

export const PyInstallerGuide: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const commandWindows = `pyinstaller --onefile --noconsole --name "TicTacToePro" --add-data "assets;assets" main.py`;
  const commandMacLinux = `pyinstaller --onefile --noconsole --name "TicTacToePro" --add-data "assets:assets" main.py`;
  const commandDebug = `pyinstaller --onefile --name "TicTacToePro_Debug" main.py`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Recommendation Card answering the User's Query */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">
            Recommendation: Should You Test the Game Before Compiling to .EXE?
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p className="text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              YES — You should definitely run and verify the game first before compiling to a standalone .EXE!
            </span>
          </p>

          <p>
            Here is why testing first is the industry best practice:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="font-semibold text-white mb-1">1. Audio & Display Verification</div>
              <p className="text-slate-400 text-[11px]">
                Ensure your PC&apos;s audio drivers and screen scale render the 800x650 Pygame window smoothly with no DPI scaling issues.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="font-semibold text-white mb-1">2. AI Logic Testing</div>
              <p className="text-slate-400 text-[11px]">
                Play against Hard difficulty to verify that the recursive Minimax algorithm calculates optimal moves with zero latency.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="font-semibold text-white mb-1">3. Text File I/O Check</div>
              <p className="text-slate-400 text-[11px]">
                Verify that <code>player_activity_log.txt</code> and <code>leaderboard.txt</code> are created and written properly in your directory.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Compilation Guide */}
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-sky-400" />
            <span>Compiling to Standalone .EXE Step-by-Step</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Follow these 3 simple terminal commands on your Windows or Mac/Linux PC.
          </p>
        </div>

        {/* Step 1 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 font-mono">STEP 1: Install PyInstaller</span>
            <button
              onClick={() => copyToClipboard("pip install pyinstaller", "step1")}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              {copiedCmd === "step1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd === "step1" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
            pip install pyinstaller
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 font-mono">STEP 2: Run PyInstaller Compilation (Windows)</span>
            <button
              onClick={() => copyToClipboard(commandWindows, "step2")}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              {copiedCmd === "step2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd === "step2" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            {commandWindows}
          </div>

          <div className="pt-2">
            <div className="text-[11px] text-slate-400 font-semibold mb-1">For Mac / Linux users:</div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 flex items-center justify-between">
              <span>{commandMacLinux}</span>
              <button
                onClick={() => copyToClipboard(commandMacLinux, "mac")}
                className="text-[11px] text-slate-400 hover:text-white cursor-pointer ml-2"
              >
                {copiedCmd === "mac" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-sky-400 font-mono">STEP 3: Launch Your Executable</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            PyInstaller creates a new folder called <code className="text-sky-300 font-mono">dist/</code> in your project directory.
            Inside <code className="text-sky-300 font-mono">dist/</code>, you will find:
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 font-bold">
            dist\TicTacToePro.exe
          </div>
          <p className="text-xs text-slate-400">
            Double-click to play! You can share this single <code>.exe</code> file with any Windows user—they do NOT need Python or Pygame installed!
          </p>
        </div>
      </div>

      {/* Flag Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white">
          PyInstaller Command Flags Explained
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                <th className="py-2.5 px-3">Flag</th>
                <th className="py-2.5 px-3">Purpose</th>
                <th className="py-2.5 px-3">Why We Use It</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 text-sky-400 font-bold">--onefile</td>
                <td className="py-2.5 px-3">Bundles everything into 1 single file</td>
                <td className="py-2.5 px-3 text-slate-400">Super easy distribution; no loose DLLs or subfolders needed.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-sky-400 font-bold">--noconsole</td>
                <td className="py-2.5 px-3">Hides the black terminal/cmd window</td>
                <td className="py-2.5 px-3 text-slate-400">Launches like a professional retail PC game directly into the Pygame window.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-sky-400 font-bold">--name &quot;TicTacToePro&quot;</td>
                <td className="py-2.5 px-3">Sets output executable filename</td>
                <td className="py-2.5 px-3 text-slate-400">Avoids generic default &quot;main.exe&quot;.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-sky-400 font-bold">--add-data &quot;assets;assets&quot;</td>
                <td className="py-2.5 px-3">Bundles sound wave assets inside .exe</td>
                <td className="py-2.5 px-3 text-slate-400">Ensures custom sound effects and ambient WAVs are packed inside the binary.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pro Tips & Debugging */}
      <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-800/50 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Pro Tip for Debugging</span>
        </div>
        <p className="text-xs text-amber-200/80 leading-relaxed">
          If your <code>.exe</code> closes immediately on launch during your first test, compile it once <em>without</em> the <code>--noconsole</code> flag:
        </p>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
          <span>{commandDebug}</span>
          <button
            onClick={() => copyToClipboard(commandDebug, "debug")}
            className="text-[11px] text-slate-400 hover:text-white cursor-pointer ml-2"
          >
            {copiedCmd === "debug" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-[11px] text-amber-300/70">
          This keeps the terminal open so you can view any tracebacks or missing audio hardware warnings!
        </p>
      </div>
    </div>
  );
};
