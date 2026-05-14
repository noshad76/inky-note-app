export const ROUTES = {
  HOME: (locale: string) => `/${locale}`,
  NOTES: (locale: string) => `/${locale}/notes`,
  SETTINGS: (locale: string) => `/${locale}/settings`,
} as const;

export type AppRoutes = typeof ROUTES;
