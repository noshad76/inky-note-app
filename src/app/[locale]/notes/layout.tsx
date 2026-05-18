"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/features/note/components/Header";
import SidebarList from "@/features/note/components/SidebarList";
import { cn } from "@/lib/utils/cn";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // بررسی اینکه آیا در صفحه ویرایش هستیم یا لیست
  const isEditing = pathname.split("/").length > 3;

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
