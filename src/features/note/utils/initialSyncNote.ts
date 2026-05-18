import { apiClient } from "@/lib/api/api-client";
import { APIROUTES } from "@/lib/constants/apiRoutes";
import { LocalNoteService } from "../service/LocalNote.service";
import { mapPullDTOToLocalNote } from "./mapper";
import { authStorage } from "@/lib/storage/auth-storage";

export const initialNotesSync = async () => {
  let page = 1;
  const limit = 50;
  let hasMore = true;

  while (hasMore) {
    const res = await apiClient.get(APIROUTES.notes.list, {
      params: { page, limit },
    });

    const notes = res.data.data;
    const userId = authStorage.getUser()?.id!;
    await LocalNoteService.upsertManyFromRemote(
      notes.map((n) => mapPullDTOToLocalNote(n, userId)),
    );

    hasMore = page < res.data.pagination.totalPages;
    page++;
  }
};
