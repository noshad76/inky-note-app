"use client";

import { Search, ArrowLeft, ArrowRight, X, Command } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { cn } from "@/lib/utils/cn";
import { useNotesSearchStore } from "../store/useNotesSearchStore";
import debounce from "lodash-es/debounce";

function HeaderSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isRtl = locale === "fa";
  const t = useTranslations("header");

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // تشخیص صفحه: اگر پارامتر id نباشد، یعنی در لیست اصلی هستیم
  const noteId = searchParams.get("id");
  const isRootNotesPage = !noteId;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const search = useNotesSearchStore((s) => s.search);
  const setSearch = useNotesSearchStore((s) => s.setSearch);
  const [inputValue, setInputValue] = useState(search);

  // هماهنگ کردن مقدار اینپوت با استور در صورتی که از جای دیگری تغییر کند
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 400),
    [setSearch],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        if (isRootNotesPage) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRootNotesPage]);

  return (
    <div className="flex-1 flex items-center justify-between md:justify-center">
      {/* دکمه بازگشت در موبایل (فقط وقتی نوت باز است) */}
      {!isRootNotesPage && (
        <div className="flex items-center md:hidden">
          <button
            onClick={() => router.push("/notes")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted/50 text-text active:scale-90 transition-all border border-border-soft/50"
          >
            <BackIcon size={20} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* بخش سرچ دسکتاپ و موبایل */}
      <div
        className={cn(
          "flex flex-1 justify-end md:justify-center",
          !isRootNotesPage && "hidden md:flex", // در موبایل اگر نوت باز بود سرچ اصلی مخفی شود
        )}
      >
        <div
          className={cn(
            "hidden md:flex items-center relative w-full transition-all duration-300 ease-in-out",
            isFocused ? "max-w-[450px]" : "max-w-[280px]",
          )}
        >
          <Search
            size={16}
            className={cn(
              "absolute left-3.5 z-10 transition-colors",
              isFocused ? "text-primary" : "text-text-muted",
            )}
          />
          <input
            ref={searchInputRef}
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t("searchPlaceholder")}
            className="w-full h-10 pl-11 pr-10 text-[13px] font-medium bg-surface-muted/40 border border-border-soft rounded-xl outline-none focus:bg-surface focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
          />
          {!inputValue && (
            <div
              className={cn(
                "absolute right-3 flex items-center gap-1 px-1.5 py-1 rounded-md bg-bg border border-border-soft pointer-events-none transition-opacity",
                isFocused ? "opacity-0" : "opacity-100",
              )}
            >
              <Command size={10} className="text-text-muted" />
              <span className="text-[9px] font-bold text-text-muted">/</span>
            </div>
          )}
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setSearch("");
              }}
              className="absolute right-3 p-1 hover:bg-surface-muted rounded-full text-text-muted"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* آیکون ذره‌بین موبایل (فقط در حالت لیست) */}
        {!isMobileOpen && isRootNotesPage && (
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden flex h-10 w-10 items-center justify-center text-text-muted hover:bg-surface-muted rounded-xl transition-all"
          >
            <Search size={22} />
          </button>
        )}
      </div>

      {/* مودال تمام‌صفحه سرچ در موبایل */}
      {isMobileOpen && isRootNotesPage && (
        <div className="fixed inset-0 z-[100] flex items-center gap-3 bg-bg px-4 md:hidden animate-in slide-in-from-top duration-200">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 text-primary" size={18} />
            <input
              value={inputValue}
              onChange={handleChange}
              autoFocus
              placeholder={t("mobileSearch")}
              className="w-full h-12 pl-11 pr-10 bg-surface-muted border-none rounded-2xl text-[15px] font-bold outline-none"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  setSearch("");
                }}
                className="absolute right-3 text-text-muted"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-sm font-bold text-primary px-2"
          >
            {t("cancel")}
          </button>
        </div>
      )}
    </div>
  );
}

// کامپوننت اصلی با Wrapper تعلیق (Suspense) برای سازگاری با Static Export
export default function HeaderSearch() {
  return (
    <Suspense fallback={<div className="flex-1 md:max-w-[280px] h-10" />}>
      <HeaderSearchContent />
    </Suspense>
  );
}
