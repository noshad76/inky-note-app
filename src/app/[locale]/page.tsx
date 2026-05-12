import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("app");

  return (
    <main className="p-6">
      <h1 className="text-title-1 text-text">{t("name")}</h1>
      <p className="text-body text-muted">{t("tagline")}</p>
    </main>
  );
}
