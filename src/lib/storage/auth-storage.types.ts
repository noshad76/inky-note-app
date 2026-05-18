import { User } from "@/features/auth/types/auth.types";

export interface AuthStorage {
  token: string;
  user: User; 
  lastSync: string|null;
}