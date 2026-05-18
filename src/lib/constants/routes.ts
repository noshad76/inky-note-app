export const ROUTES = {
  HOME: "/",

  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },

  NOTES: {
    ROOT: "/notes",
    DETAIL: (id: string) => `/notes/${id}`,
    SETTINGS: "/notes/setting",
  },
} as const;

export type AppRoutes = typeof ROUTES;
