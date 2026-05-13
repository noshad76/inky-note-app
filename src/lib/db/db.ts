import Dexie, { Table } from 'dexie';
import { LocalNote } from '@/features/note/types/notes';

export class NotshDatabase extends Dexie {
  notes!: Table<LocalNote>;

  constructor() {
    super('notsh_db');
    
    this.version(1).stores({
      notes: 'id, userId, updatedAt, syncStatus, deletedAt'
    });
  }
}

export const db = new NotshDatabase();
