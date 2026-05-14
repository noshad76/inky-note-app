"use client";
import Image from "next/image";
import appLogo from "@/../public/typo_graphy.png";
import { User } from "lucide-react";
import HeaderSearch from "./HeaderSearch";
import { useRouter, usePathname, Link } from "@/i18n/navigation"; // اضافه شدن usePathname
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
const t = useTranslations("header");
  // تشخیص صفحه اصلی نوت‌ها
  const isRootNotesPage = pathname === "/notes" || pathname === "/";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 h-16 bg-bg/80 backdrop-blur-md border-b border-border-soft/50">
      {/* بخش لوگو: در موبایل اگر صفحه اصلی نباشد، مخفی می‌شود */}
      <div
        className={cn(
          "items-center mr-4",
          isRootNotesPage ? "flex" : "hidden md:flex",
        )}
      >
        <div
          onClick={() => router.push("/notes")}
          className="relative group cursor-pointer"
        >
          <Image
            src={appLogo}
            alt="inkey"
            width={70}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* بخش میانی و دکمه بازگشت */}
      <HeaderSearch />

      {/* سمت راست: ابزارها */}
      <div className="flex items-center gap-3 ml-4">
        {/* Synced - فقط دسکتاپ */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/5 border border-success/10">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black text-success uppercase tracking-widest">
            {t("synced")}
          </span>
        </div>

        {/* دکمه پروفایل */}
        <Link
          href={"/notes/setting"}
          className="relative w-9 h-9 rounded-xl bg-surface border border-border-soft flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <User
            size={18}
            className="text-text-soft group-hover:text-primary transition-colors"
          />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-bg" />
        </Link>
      </div>
    </header>
  );
}
