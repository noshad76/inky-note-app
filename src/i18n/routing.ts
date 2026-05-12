import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa"],
  defaultLocale: "en",
  //   pathnames: {
  //     '/': '/',
  //     '/pathnames': {
  //       de: '/pfadnamen'
  //     }
  //   }
});
