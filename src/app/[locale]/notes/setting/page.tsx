"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("settings");

  // استفاده از یک استیت محلی برای مدیریت کلاس‌های وابسته به تم بدون شکستن Hydration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-soft/50 py-6 last:border-0">
      <span className="text-sm font-bold text-text-soft">{title}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-in fade-in duration-700">
      <h2 className="mb-8 text-2xl font-black text-text tracking-tight">
        {t("title")}
      </h2>

      <div className="space-y-1 bg-surface/30 p-6 rounded-3xl border border-border-soft/20 shadow-sm">
        
        {/* Theme Selection */}
        <Section title={t("theme")}>
          <div className="flex rounded-xl border border-border-soft bg-surface p-1 shadow-sm">
            {(["light", "dark"] as const).map((tKey) => {
              // در سرور هیچ دکمه‌ای فعال نشان داده نمی‌شود تا Mismatch رخ ندهد
              // بعد از Mount شدن در کلاینت، دکمه درست هایلایت می‌شود
              const isActive = mounted && theme === tKey;
              
              return (
                <button
                  key={tKey}
                  onClick={() => setTheme(tKey)}
                  suppressHydrationWarning
                  className={cn(
                    "px-6 py-2 text-[11px] font-black rounded-lg transition-all uppercase tracking-wider",
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-text-muted hover:text-text hover:bg-surface-muted"
                  )}
                >
                  {tKey === "light" ? t("themes.light") : t("themes.dark")}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Language Selection */}
        <Section title={t("language")}>
          <div className="flex rounded-xl border border-border-soft bg-surface p-1 shadow-sm">
            {[
              { label: "فارسی", code: "fa" },
              { label: "English", code: "en" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={cn(
                  "px-6 py-2 text-[11px] font-black rounded-lg transition-all",
                  locale === lang.code
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-text-muted hover:text-text hover:bg-surface-muted"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Display Name Setting */}
        <Section title={t("displayName")}>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder={t("placeholderName")}
              dir={locale === "fa" ? "rtl" : "ltr"}
              className={cn(
                "h-11 w-full md:w-64 rounded-xl border border-border-soft bg-surface px-4 text-xs font-bold outline-none transition-all shadow-sm",
                "focus:border-primary focus:ring-4 focus:ring-primary/5 placeholder:text-text-muted/50"
              )}
            />
            <button className="h-11 rounded-xl bg-primary px-6 text-[11px] font-black text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all whitespace-nowrap">
              {t("save")}
            </button>
          </div>
        </Section>

      </div>
    </div>
  );
}
