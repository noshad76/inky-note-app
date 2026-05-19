import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/share/components/themeProvider";
import { Providers } from "./providers";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const dir = locale === "fa" ? "rtl" : "ltr";
  setRequestLocale(locale);

  return (
    <html spellCheck="false" lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Providers>
            <div className="bg-bg min-h-screen">
              <NextIntlClientProvider locale={locale}>
                {children}
              </NextIntlClientProvider>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
