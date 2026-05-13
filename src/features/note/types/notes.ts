export type SyncStatus = "pending" | "synced" | "failed";

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
}

export interface LocalNote extends Note {
  syncStatus: SyncStatus;
}
