// import { getTranslations, setRequestLocale } from "next-intl/server";
// import Image from "next/image";
// import appIcon from "../../../public/typo_graphy.png";
// import { Locale } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { redirect } from "next/navigation";
export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  redirect(locale + "/" + ROUTES.NOTES.ROOT);
  // setRequestLocale(locale as Locale);

  // const t = await getTranslations("app");

  // return (
  //   <main className="p-6">
  //     <Image src={appIcon} alt="app icon" width={300} height={300} />
  //     <h1 className="text-title-1 text-primary">{t("name")}</h1>
  //     <p className="text-body text-muted">{t("tagline")}</p>
  //   </main>
  // );
}
