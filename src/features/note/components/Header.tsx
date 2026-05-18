"use client";

import Image from "next/image";
import appLogo from "@/../public/typo_graphy.png";
import { User, Cloud, Check, Loader2, X } from "lucide-react";
import HeaderSearch from "./HeaderSearch";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { authStorage } from "@/lib/storage/auth-storage";
import { useEffect, useState } from "react";
import { useSyncNotes } from "../hooks/useSyncNotes";
import { useMutationState } from "@tanstack/react-query";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");
  const { triggerSync } = useSyncNotes();
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
  const isRootNotesPage =
    pathname === ROUTES.NOTES.ROOT || pathname === ROUTES.HOME;

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(authStorage.getToken());
  }, []);

  const renderSyncStatus = () => {
    if (isSyncing) {
      return (
        <>
          <Loader2 size={14} className="text-primary animate-spin" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {t("syncing")}
          </span>
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <Check size={14} className="text-success" />
          <span className="text-[10px] font-bold text-success uppercase tracking-widest">
            {t("synced")}
          </span>
        </>
      );
    }

    if (isError) {
      return (
        <>
          <X size={14} className="text-danger" />
          <span className="text-[10px] font-bold text-danger uppercase tracking-widest">
            {t("syncError")}
          </span>
        </>
      );
    }

    return (
      <>
        <Cloud size={14} className="text-text-soft" />
        <span className="text-[10px] font-bold text-text-soft uppercase tracking-widest">
          {t("sync")}
        </span>
      </>
    );
  };

  const syncButtonClassName = cn(
    "hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors duration-300",
    isSuccess && "bg-success/5 border border-success/10 hover:bg-success/10",
    isSyncing && "bg-primary/5 border border-primary/10 hover:bg-primary/10",
    isError && "bg-danger/5 border border-danger/10 hover:bg-danger/10",
    !isSyncing &&
      !isSuccess &&
      !isError &&
      "bg-surface border border-border hover:bg-primary/5 hover:border-primary/30",
  );

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 h-16 bg-bg/80 shadow-xs border-border backdrop-blur-md border-b">
      <div
        className={cn(
          "items-center mr-4",
          isRootNotesPage ? "flex" : "hidden md:flex",
        )}
      >
        <div
          onClick={() => router.push(ROUTES.NOTES.ROOT)}
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

      <HeaderSearch />

      <div className="flex items-center gap-3 ml-4">
        <button
          onClick={() => {
            if (!token) {
              router.replace(ROUTES.AUTH.LOGIN);
            } else {
              if (!isSyncing) triggerSync();
            }
          }}
          disabled={isSyncing}
          className={syncButtonClassName}
        >
          {renderSyncStatus()}
        </button>

        <Link
          href={token ? ROUTES.NOTES.SETTINGS : ROUTES.AUTH.LOGIN}
          className="relative w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <User
            size={18}
            className="text-text-soft group-hover:text-primary transition-colors"
          />
          {token && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-bg" />
          )}
        </Link>
      </div>
    </header>
  );
}
