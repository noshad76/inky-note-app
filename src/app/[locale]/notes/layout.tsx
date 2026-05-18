"use client";
import { ReactNode, Suspense } from "react"; // اضافه کردن Suspense
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/features/note/components/Header"), {
  ssr: false,
});

import SidebarList from "@/features/note/components/SidebarList";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

// ایجاد یک کامپوننت داخلی برای استفاده از searchParams
function NotesLayoutContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const isEditing = !!searchParams.get("id");

  return (
    <div className="flex h-screen flex-col bg-bg text-text transition-colors duration-300">
      <Header />
      <div className="flex flex-1 overflow-hidden p-0 md:p-4 gap-0 md:gap-5">
        <aside
          className={cn(
            "flex-col border-border bg-surface shadow-sm transition-all duration-300",
            "md:rounded-lg overflow-hidden md:border",
            isEditing
              ? "hidden md:flex md:w-80"
              : "flex w-full md:w-80 border-r md:border-r",
          )}
        >
          <SidebarList />
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

// کامپوننت اصلی که Suspense را فراهم می‌کند
export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen bg-bg" />}>
      <NotesLayoutContent>{children}</NotesLayoutContent>
    </Suspense>
  );
}
