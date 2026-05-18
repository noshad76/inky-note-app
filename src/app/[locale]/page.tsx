"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants/routes";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.NOTES.ROOT);
  }, [router]);

  return null;
}
