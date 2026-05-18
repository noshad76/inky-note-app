import { STORAGE_KEYS } from "./storage-keys";
import { AuthStorage } from "./auth-storage.types";

class AuthStorageService {
  private key = STORAGE_KEYS.AUTH;

  private isBrowser() {
    return typeof window !== "undefined";
  }

  get(): AuthStorage | null {
    if (!this.isBrowser()) return null;

    const data = localStorage.getItem(this.key);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  set(data: AuthStorage) {
    if (!this.isBrowser()) return;

    localStorage.setItem(this.key, JSON.stringify(data));
  }

  update(partial: Partial<AuthStorage>) {
    const current = this.get();

    const updated: AuthStorage = {
      token: partial.token ?? current?.token ?? "",
      user: partial.user ?? current?.user ?? null,
      lastSync: partial.lastSync ?? current?.lastSync ?? "1970-01-01T00:00:00.000Z",
    };

    this.set(updated);
  }

  clear() {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.key);
  }

  getToken(): string | null {
    return this.get()?.token ?? null;
  }

  getUser() {
    return this.get()?.user ?? null;
  }

  getLastSync(): string | null {
    return this.get()?.lastSync ?? null;
  }

  updateLastSync() {
    const current = this.get();
    if (!current) return;

    this.set({
      ...current,
      lastSync: new Date().toISOString(),
    });
  }
}

export const authStorage = new AuthStorageService();
