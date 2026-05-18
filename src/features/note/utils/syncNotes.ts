import { apiClient } from "@/lib/api/api-client";
import { APIROUTES } from "@/lib/constants/apiRoutes";
import { LocalNoteService, RemoteNote } from "../service/LocalNote.service";
import { mapLocalNoteToPushDTO, mapPullDTOToLocalNote } from "./mapper";
import { authStorage } from "@/lib/storage/auth-storage";

export const syncNotes = async (): Promise<void> => {
  // Only sync if online
  if (typeof window !== "undefined" && !navigator.onLine) {
    console.log("Sync skipped: Offline");
    return;
  }

  try {
    console.log("Sync: Pushing local changes...");
    const pendingNotes = await LocalNoteService.getPendingNotes();

    if (pendingNotes.length > 0) {
      const pushDTOs = pendingNotes.map(mapLocalNoteToPushDTO);
      await apiClient.post(APIROUTES.notes.push, { notes: pushDTOs });

      await LocalNoteService.markNotesSynced(
        pendingNotes.map((note) => note.id),
      );
      console.log(`Sync: Pushed ${pendingNotes.length} pending notes.`);
    }

    console.log("Sync: Pulling remote changes...");
    const since = authStorage.getLastSync();

    const res = await apiClient.get<{ notes: RemoteNote[] }>(
      APIROUTES.notes.pull,
      {
        params: since ? { since } : {},
      },
    );

    const userId = authStorage.getUser()?.id!;
    const remoteNotes = res.data.notes.map((n) =>
      mapPullDTOToLocalNote(n, userId),
    );

    if (remoteNotes.length > 0) {
      await LocalNoteService.upsertManyFromRemote(remoteNotes);
      console.log(
        `Sync: Pulled and upserted ${remoteNotes.length} remote notes.`,
      );
    }

    authStorage.updateLastSync();
    console.log("Sync: Completed successfully.");
  } catch (error) {
    console.error("Sync failed:", error);
  }
};
