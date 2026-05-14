"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/share/components/Header";
import SidebarList from "@/share/components/SidebarList";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // بررسی اینکه آیا در صفحه ادیتور نوت هستیم (مخصوص موبایل)
  const isEditing = pathname.split("/").length > 3;

  return (
    <div className="flex h-screen flex-col bg-[#F8F9FB] dark:bg-neutral-950">
      {/* Header - در موبایل وقتی در حال ادیت هستیم مخفی یا متفاوت می‌شود */}
      {!isEditing && <Header />}

      <div className="flex flex-1 overflow-hidden p-2 md:p-4 gap-4">
        {/* Sidebar: شامل دکمه New، لیست نوت‌ها و دکمه Setting */}
        <aside
          className={`
          ${isEditing ? "hidden md:flex" : "flex"} 
          w-full md:w-80 flex-col rounded-2xl border border-neutral-200 
          bg-white dark:border-neutral-800 dark:bg-neutral-900
        `}
        >
          <SidebarList />
        </aside>

        {/* Main Content: ادیتور */}
        <main
          className={`
          ${isEditing ? "flex" : "hidden md:flex"} 
          flex-1 flex-col rounded-2xl border border-neutral-200 
          bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden
        `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
