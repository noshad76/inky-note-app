import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { ThemeProvider } from "@/share/components/themeProvider";
import localFont from "next/font/local";
import { Providers } from "./providers";

const vazir = localFont({
  src: "../../../public/fonts/Vazir-FD-WOL.ttf",
  variable: "--font-vazir",
  display: "swap",
});

const patrick = localFont({
  src: "../../../public/fonts/Handlee-Regular.ttf",
  variable: "--font-patrick",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "app" });

  return {
    title: t("name"),
    description: t("tagline"),
  };
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
    <html
      lang={locale}
      dir={dir}
      className={`${vazir.variable} ${patrick.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased font-[family-name:var(--font-patrick),var(--font-vazir)]">
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
