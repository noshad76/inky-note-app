"use client";

import Image from "next/image";
import appLogo from "@/../public/typo_graphy.png";
import {
  // User,
  Cloud,
  Check,
  Loader2,
  X,
} from "lucide-react";
import HeaderSearch from "./HeaderSearch";
import {
  useRouter,
  //  Link
} from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { authStorage } from "@/lib/storage/auth-storage";
import { useEffect, useState, Suspense } from "react";
// import { useSyncNotes } from "../hooks/useSyncNotes";
import { useMutationState } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { WindowControls } from "@/share/components/WindowControls";
// تابع مدیریت درگ هوشمند - اصلاح شده برای بیلد
const handleDrag = async (e: React.MouseEvent) => {
  // ۱. بررسی محیط مرورگر
  if (typeof window === "undefined") return;

  // ۲. فقط کلیک چپ
  if (e.button !== 0) return;

  // ۳. بررسی اینکه آیا کلیک روی المان‌های تعاملی بوده یا خیر
  const target = e.target as HTMLElement;
  const isInteractive = target.closest(
    'button, input, a, .window-control-btn, [role="button"]',
  );

  // ۴. اگر روی المان تعاملی نبود، درگ شروع شود
  if (!isInteractive) {
    try {
      // ایمپورت داینامیک فقط در لحظه اجرا در کلاینت
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const appWindow = getCurrentWindow();
      await appWindow.startDragging();
    } catch (error) {
      console.error("Failed to start dragging:", error);
    }
  }
};

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("header");
  // const { triggerSync } = useSyncNotes();

  const mutationStates = useMutationState({
    filters: { mutationKey: ["notes-sync"] },
    select: (mutation) => mutation.state.status,
  });

  const latestStatus =
    mutationStates.length > 0
      ? mutationStates[mutationStates.length - 1]
      : "idle";
  const isSyncing = latestStatus === "pending";
  const isSuccess = latestStatus === "success";
  const isError = latestStatus === "error";

  const noteId = searchParams.get("id");
  const isRootNotesPage = !noteId;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(authStorage.getToken());
  }, []);

  const renderSyncStatus = () => {
    if (isSyncing)
      return (
        <>
          <Loader2 size={14} className="text-primary animate-spin" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {t("syncing")}
          </span>
        </>
      );
    if (isSuccess)
      return (
        <>
          <Check size={14} className="text-success" />
          <span className="text-[10px] font-bold text-success uppercase tracking-widest">
            {t("synced")}
          </span>
        </>
      );
    if (isError)
      return (
        <>
          <X size={14} className="text-danger" />
          <span className="text-[10px] font-bold text-danger uppercase tracking-widest">
            {t("syncError")}
          </span>
        </>
      );
    return (
      <>
        <Cloud size={14} className="text-text-soft" />
        <span className="text-[10px] font-bold text-text-soft uppercase tracking-widest">
          {t("sync")}
        </span>
      </>
    );
  };

  return (
    <header
      onMouseDown={handleDrag}
      className="sticky top-0 z-50 flex items-center justify-between h-14 bg-bg/80 border-b border-border backdrop-blur-md select-none cursor-default w-full active:cursor-grabbing"
    >
      {/* بخش چپ */}
      <div className="flex items-center gap-4 px-4 h-full flex-shrink-0">
        <div
          onClick={() => router.push(ROUTES.NOTES.ROOT)}
          className={cn(
            "relative group cursor-pointer transition-all",
            isRootNotesPage ? "flex" : "hidden md:flex",
          )}
        >
          <Image
            src={appLogo}
            alt="inkey"
            width={65}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* <button
          onClick={() => {
            if (!token) router.replace(ROUTES.AUTH.LOGIN);
            else if (!isSyncing) triggerSync();
          }}
          disabled={isSyncing}
          className={cn(
            "hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border",
            isSyncing
              ? "bg-primary/5 border-primary/20"
              : "bg-surface border-border hover:border-primary/30",
          )}
        >
          {renderSyncStatus()}
        </button> */}
      </div>

      {/* بخش وسط */}
      <div className="flex-1 h-full flex items-center justify-center min-w-[100px]">
        <div className="w-full max-w-2xl px-4">
          <Suspense
            fallback={
              <div className="h-10 w-full bg-surface-muted/20 rounded-xl animate-pulse" />
            }
          >
            <HeaderSearch />
          </Suspense>
        </div>
      </div>

      {/* بخش راست */}
      <div className="flex items-center h-full flex-shrink-0">
        {/* <div className="flex items-center px-4 border-l border-border/50 h-8">
          <Link
            href={token ? ROUTES.NOTES.SETTINGS : ROUTES.AUTH.LOGIN}
            className="relative w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            <User
              size={16}
              className="text-text-soft group-hover:text-primary transition-colors"
            />
            {token && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-bg" />
            )}
          </Link>
        </div> */}

        <div className="h-full flex items-center">
          <WindowControls />
        </div>
      </div>
    </header>
  );
}
