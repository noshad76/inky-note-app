"use client";

import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { X, Minus, Maximize2, ShrinkIcon } from "lucide-react";

const appWindow = getCurrentWindow();

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateStatus = async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    };

    updateStatus();
    const unlisten = appWindow.onResized(() => updateStatus());
    return () => {
      unlisten.then((u) => u());
    };
  }, []);

  const handleAction = async (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (action === "close") await appWindow.close();
    else if (action === "minimize") await appWindow.minimize();
    else if (action === "maximize") await appWindow.toggleMaximize();
  };

  return (
    <div
      className="flex items-center gap-2.5 px-4 h-full pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Minimize - Yellow */}
      <button
        onClick={(e) => handleAction(e, "minimize")}
        className="w-3.5 h-3.5 rounded-full bg-[#febc2e] border border-[#d8a027] flex items-center justify-center transition-all active:opacity-70"
      >
        <Minus
          size={10}
          className={`text-black/60 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
          strokeWidth={4}
        />
      </button>

      {/* Maximize/Restore - Green */}
      <button
        onClick={(e) => handleAction(e, "maximize")}
        className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#21a835] flex items-center justify-center transition-all active:opacity-70"
      >
        <div
          className={`text-black/60 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <Maximize2 size={8} strokeWidth={4} />
        </div>
      </button>

      {/* Close - Red */}
      <button
        onClick={(e) => handleAction(e, "close")}
        className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e14942] flex items-center justify-center transition-all active:opacity-70"
      >
        <X
          size={10}
          className={`text-black/60 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
          strokeWidth={4}
        />
      </button>
    </div>
  );
}
