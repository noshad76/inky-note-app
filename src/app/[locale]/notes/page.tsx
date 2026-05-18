"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const NoteClientPage = dynamic(() => import("./NoteClientPage"), {
  ssr: false,
});
const EmptyNoteState = dynamic(() => import("./EmptyNoteState"), {
  ssr: false,
});

function NotePageContent() {
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id");

  if (!noteId) {
    return <EmptyNoteState />;
  }

  return <NoteClientPage noteId={noteId} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-bg" />}>
      <NotePageContent />
    </Suspense>
  );
}
