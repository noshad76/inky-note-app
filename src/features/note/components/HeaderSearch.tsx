"use client";
import { Search, ArrowLeft, ArrowRight, X, Command } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

export default function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = locale === "fa";

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isRootNotesPage = pathname === "/notes" || pathname === "/";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
const t = useTranslations("header");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-between md:justify-center">
      {/* سمت چپ: دکمه بازگشت (فقط در موبایل و صفحات داخلی) */}
      <div className="flex items-center md:hidden">
        {!isRootNotesPage && (
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted/50 text-text active:scale-90 transition-all border border-border-soft/50"
          >
            <BackIcon size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* بخش مرکزی: جستجو */}
      {isRootNotesPage && (
        <div className="flex flex-1 justify-end md:justify-center">
          {/* دسکتاپ: ورودی جستجو */}
          <div
            className={cn(
              "hidden md:flex items-center relative w-full transition-all duration-500 ease-in-out",
              isFocused ? "max-w-[500px]" : "max-w-[320px]",
            )}
          >
            <Search
              size={16}
              strokeWidth={isFocused ? 2.5 : 2}
              className={cn(
                "absolute left-3.5 z-10 transition-colors",
                isFocused ? "text-primary" : "text-text-muted",
              )}
            />
            <input
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t("searchPlaceholder")}
              className={cn(
                "w-full h-10 pl-11 pr-12 text-[13px] font-semibold transition-all",
                "bg-surface-muted/40 border border-border-soft rounded-2xl outline-none",
                "focus:bg-surface focus:border-primary/30 focus:ring-[4px] focus:ring-primary/5",
              )}
            />
            <div
              className={cn(
                "absolute right-3 flex items-center gap-1 px-1.5 py-1 rounded-md bg-bg border border-border-soft transition-opacity",
                isFocused ? "opacity-0" : "opacity-100",
              )}
            >
              <Command
                size={10}
                className="text-text-muted"
                strokeWidth={2.5}
              />
              <span className="text-[9px] font-black text-text-muted">K</span>
            </div>
          </div>

          {/* موبایل: آیکون ذره‌بین برای باز کردن جستجوی تمام‌صفحه */}
          {!isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center text-text-muted hover:bg-surface-muted rounded-xl transition-all"
            >
              <Search size={22} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}

      {/* موبایل: لایه تمام صفحه جستجو */}
      {isMobileOpen && isRootNotesPage && (
        <div className="fixed inset-0 z-[100] flex items-center gap-3 bg-bg px-4 md:hidden animate-in fade-in duration-200">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-text-muted"
          >
            <BackIcon size={22} strokeWidth={2.5} />
          </button>

          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
              size={18}
              strokeWidth={2.5}
            />
            <input
              autoFocus
              placeholder={t("mobileSearch")}
              className="w-full h-12 pl-11 pr-4 bg-surface-muted border-none rounded-2xl text-[15px] font-bold outline-none"
            />
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-text-muted"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
