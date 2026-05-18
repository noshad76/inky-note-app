"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import emptyImage from "@/../public/empty_state_notes_page.png";
import { useRouter } from "@/i18n/navigation";
import { useNotes } from "@/features/note/hooks/useNotes";
import { useNoteStore } from "@/features/note/store/useNoteStore";
import { ROUTES } from "@/lib/constants/routes";
import { useSyncNotes } from "@/features/note/hooks/useSyncNotes";
import { scheduleSync } from "@/features/note/utils/syncScheduler";

const EmptyNoteState = () => {
  const t = useTranslations("notes");
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const { createNote } = useNotes();
  const setActiveNoteId = useNoteStore((e) => e.setActiveNoteId);
  const router = useRouter();
  const { triggerSync } = useSyncNotes();
  const handleCreateNote = async () => {
    const newNote = await createNote();
    scheduleSync(triggerSync);
    if (newNote?.id) {
      setActiveNoteId(newNote.id);
      router.push(ROUTES.NOTES.DETAIL(newNote.id));
    }
  };
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      gsap.set([imageRef.current, textRef.current, buttonRef.current], {
        opacity: 0,
      });

      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
      )
        .fromTo(
          imageRef.current,
          { y: 40, opacity: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, ease: "back.out(1.2)" },
          "-=0.3",
        )
        .fromTo(
          textRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.5", 
        )
        .fromTo(
          buttonRef.current,
          { y: 15, scale: 0.9, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "back.out(1.7)",
            duration: 0.7,
          },
          "-=0.6",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-bg"
    >
      <div className="flex max-w-sm flex-col items-center">
        <div ref={imageRef} className="relative mb-10 group">
          <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:bg-primary/20" />
          <Image
            src={emptyImage}
            alt="Empty State"
            width={240}
            height={240}
            priority
            className="relative drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div ref={textRef} className="space-y-3">
          <h3 className="text-title-3 text-text">{t("emptyState.title")}</h3>
          <p className="text-body-soft max-w-[280px] mx-auto mb-8">
            {t("emptyState.description")}
          </p>
        </div>

        <div ref={buttonRef} className="mt-8">
          <button
            onClick={handleCreateNote}
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-primary px-8 py-4 text-[12px] font-bold text-white shadow-lg  transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 group-hover:rotate-90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="relative z-10">{t("emptyState.button")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyNoteState;
