"use client";
import { ReactNode, Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/features/note/components/Header"), {
  ssr: false,
});

import SidebarList from "@/features/note/components/SidebarList";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

function NotesLayoutContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const isEditing = !!searchParams.get("id");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        setSidebarCollapsed(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-bg text-text transition-colors duration-300">
      <Header />
      <div className="flex flex-1 overflow-hidden p-0 md:p-4 gap-0 md:gap-5">
        <aside
          className={cn(
            "flex-col border-border bg-surface shadow-sm transition-all duration-300",
            "md:rounded-lg overflow-hidden md:border",
            isEditing
              ? cn("hidden md:flex", sidebarCollapsed ? "md:w-12" : "md:w-80")
              : cn(
                  "flex w-full border-r md:border-r",
                  sidebarCollapsed ? "md:w-12" : "md:w-80",
                ),
          )}
        >
          <SidebarList
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
          />
        </aside>

        <main
          className={cn(
            "flex-1 min-h-0 flex-col overflow-hidden bg-surface shadow-sm transition-all duration-300",
            "md:rounded-lg md:border md:border-border",
            isEditing ? "flex w-full" : "hidden md:flex",
          )}
        >
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen bg-bg" />}>
      <NotesLayoutContent>{children}</NotesLayoutContent>
    </Suspense>
  );
}
