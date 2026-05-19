"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function WindowControls() {
  const [appWindow, setAppWindow] = useState<any>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    const initTauri = async () => {
      // بررسی دقیق تر محیط Tauri
      const isRunningInTauri =
        typeof window !== "undefined" &&
        (window as any).__TAURI_INTERNALS__ !== undefined;

      if (isRunningInTauri) {
        setIsTauri(true);
        try {
          const { getCurrentWindow } = await import("@tauri-apps/api/window");
          const win = getCurrentWindow();
          setAppWindow(win);

          // گرفتن وضعیت اولیه
          const maximized = await win.isMaximized();
          setIsMaximized(maximized);

          // در Tauri v2 تابع listen به این شکل عمل می‌کند
          const unlisten = await win.onResized(async () => {
            const status = await win.isMaximized();
            setIsMaximized(status);
          });

          return unlisten;
        } catch (error) {
          console.error("Tauri API Error:", error);
        }
      } else {
        // اگر در مرورگر عادی هستیم (برای دیباگ)
        console.log("Running in browser, window controls disabled.");
        setIsTauri(false);
      }
    };

    const unlistenPromise = initTauri();

    return () => {
      unlistenPromise.then((unlisten) => {
        if (typeof unlisten === "function") unlisten();
      });
    };
  }, []);

  const handleAction = async (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (!appWindow) return;

    try {
      if (action === "close") await appWindow.close();
      else if (action === "minimize") await appWindow.minimize();
      else if (action === "maximize") {
        await appWindow.toggleMaximize();
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  // اگر در محیط تائوری نباشیم، کلا چیزی رندر نشود (یا دکمه‌های غیرفعال)
  if (!isTauri && typeof window !== "undefined") {
    return null;
  }

  // نمایش اسکلتون فقط تا زمانی که appWindow در محیط تائوری لود شود
  if (!appWindow && isTauri) {
    return (
      <div className="flex items-center gap-1 px-3 h-full mr-2 pr-2">
        <div className="w-8 h-8 rounded-lg bg-surface-muted/20 animate-pulse" />
        <div className="w-8 h-8 rounded-lg bg-surface-muted/20 animate-pulse" />
        <div className="w-8 h-8 rounded-lg bg-surface-muted/20 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-3 h-full select-none mr-2 pr-2">
      {/* Minimize */}
      <button
        onClick={(e) => handleAction(e, "minimize")}
        className="group relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 hover:bg-white/5 active:scale-90"
      >
        <div className="w-4 h-[2px] bg-white/40 group-hover:bg-amber-500 transition-all duration-300 rounded-full" />
      </button>

      {/* Maximize / Restore */}
      <button
        onClick={(e) => handleAction(e, "maximize")}
        className="group relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 hover:bg-white/5 active:scale-90"
      >
        <div
          className={`border-2 transition-all duration-300 rounded-[4px]
          ${
            isMaximized
              ? "w-3 h-3 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              : "w-3.5 h-3.5 border-white/40 group-hover:border-emerald-500"
          }`}
        />
      </button>

      {/* Close */}
      <button
        onClick={(e) => handleAction(e, "close")}
        className="group relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 hover:bg-red-500/20 active:scale-90"
      >
        <X
          size={18}
          className="text-white/40 group-hover:text-red-500 transition-all duration-500"
        />
      </button>
    </div>
  );
}
