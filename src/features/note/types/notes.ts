export type SyncStatus = "pending" | "synced" | "failed";

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LocalNote extends Note {
  syncStatus: SyncStatus;
}

export interface NotePushPayload {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PushNotesRequest {
  notes: NotePushPayload[];
}

export interface PullNotesResponse {
  notes: Note[];
}

export interface NotesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface GetNotesResponse {
  data: Note[];
  pagination: NotesPagination;
}
export interface GetNotesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}