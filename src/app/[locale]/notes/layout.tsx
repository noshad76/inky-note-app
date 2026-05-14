"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/features/note/components/Header";
import SidebarList from "@/features/note/components/SidebarList";
import { cn } from "@/lib/utils/cn";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // بررسی وضعیت ویرایش (اگر عمق مسیر بیشتر از ۳ باشد)
  const isEditing = pathname.split("/").length > 3;

  return (
    <div className="flex h-screen flex-col bg-bg text-text transition-colors duration-300">
      {/* نمایش هدر فقط در صورتی که در حالت ویرایش موبایل نباشیم */}
      <Header />

      <div className="flex flex-1 overflow-hidden p-2 md:p-4 gap-3 md:gap-5">
        {/* بخش سایدبار */}
        <aside
          className={cn(
            // ساختار کلی
            "flex-col border border-border bg-surface shadow-sm transition-all duration-300",
            "rounded-lg overflow-hidden", // استفاده از radius-lg تم شما (16px)
            // مدیریت نمایش در موبایل و دسکتاپ
            isEditing ? "hidden md:flex md:w-80" : "flex w-full md:w-80",
          )}
        >
          <SidebarList />
        </aside>

        {/* بخش محتوای اصلی (Editor یا Empty State) */}
        <main
          className={cn(
            // ساختار کلی
            "flex-1 flex-col border border-border bg-surface shadow-sm transition-all duration-300",
            "rounded-lg overflow-hidden",
            // مدیریت نمایش در موبایل: اگر در حال ویرایش نیستیم، در موبایل مخفی شود
            !isEditing ? "hidden md:flex" : "flex",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
