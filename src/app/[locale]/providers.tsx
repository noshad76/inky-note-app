"use client";

import { initialNotesSync } from "@/features/note/utils/initialSyncNote";
import { syncNotes } from "@/features/note/utils/syncNotes";
import { NotificationContainer } from "@/share/components/notification-container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  useEffect(() => {
    const run = async () => {
      await initialNotesSync();
      await syncNotes();
    };

    run();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationContainer />
      {children}
    </QueryClientProvider>
  );
}
