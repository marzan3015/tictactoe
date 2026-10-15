import JSZip from "jszip";
import { PYTHON_FILES, PythonFileItem } from "../data/pythonFiles";

/**
 * Client-side ZIP generator using JSZip.
 * Generates a valid standard PKZip archive directly in browser memory,
 * avoiding any static server 404/SPA routing issues.
 */
export async function downloadProjectZip(onProgress?: (percent: number) => void): Promise<void> {
  const zip = new JSZip();

  // Root folder in the zip
  const folder = zip.folder("pygame_tictactoe_pro") || zip;

  // Add all project files
  for (const file of PYTHON_FILES) {
    folder.file(file.name, file.content);
  }

  // Also include Mac/Linux shell script for building executable
  const buildShContent = `#!/usr/bin/env bash
echo "============================================================"
echo "Compiling Pygame Tic-Tac-Toe Pro to Executable (Linux/macOS)"
echo "============================================================"

python3 -m pip install -r requirements.txt
python3 -m pip install pyinstaller

echo ""
echo "Building executable with PyInstaller..."
pyinstaller --onefile --noconsole --name "TicTacToePro" --add-data "assets:assets" main.py

echo ""
echo "Compilation complete! Executable is in: dist/TicTacToePro"
`;
  folder.file("build_exe.sh", buildShContent);

  // Generate the binary ZIP blob
  const zipBlob = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 9 }
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  // Trigger standard browser download
  const blobUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "pygame_tictactoe_project.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

/**
 * Downloads each file individually into the browser's download folder
 * with a slight stagger so the browser does not throttle downloads.
 */
export async function downloadAllFilesIndividually(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const total = PYTHON_FILES.length;

  for (let i = 0; i < total; i++) {
    const file = PYTHON_FILES[i];
    downloadSingleFile(file);
    if (onProgress) {
      onProgress(i + 1, total);
    }
    // 120ms delay between download triggers to prevent browser blocking
    await new Promise((resolve) => setTimeout(resolve, 140));
  }
}

/**
 * Downloads a single text/code file.
 */
export function downloadSingleFile(file: PythonFileItem): void {
  const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
