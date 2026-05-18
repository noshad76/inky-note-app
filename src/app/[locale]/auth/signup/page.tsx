"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { signupSchema, SignupInput } from "@/features/auth/types/auth.schema";
import { useSignup } from "@/features/auth/hooks/use-auth";
import { Link, redirect, useRouter } from "@/i18n/navigation";
import { TextField } from "@/features/auth/components/text-field";
import { ROUTES } from "@/lib/constants/routes";
import { authStorage } from "@/lib/storage/auth-storage";
import { useEffect } from "react";

export default function SignupPage() {
  const t = useTranslations("auth.signup");
  const { mutate: signup, isPending } = useSignup();
  const router = useRouter();

  useEffect(() => {
    if (authStorage.getToken()) {
      router.replace(ROUTES.NOTES.ROOT);
    }
  }, [router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: SignupInput) => {
    signup({ email: data.email, name: data.name, password: data.password });
    router.replace(ROUTES.NOTES.ROOT);
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in duration-500">
      <header className="text-center mb-10 space-y-2">
        <h1 className="text-title-1 text-text tracking-tight">{t("title")}</h1>
        <p className="text-body-soft">{t("subtitle")}</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        <TextField
          {...register("name")}
          label={t("nameLabel")}
          id="name"
          placeholder="e.g. John Doe"
          error={errors.name?.message}
        />

        <TextField
          {...register("email")}
          label={t("emailLabel")}
          id="email"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
        />

        <TextField
          {...register("password")}
          label={t("passwordLabel")}
          id="password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
        />

        <TextField
          {...register("confirmPassword")}
          label={t("confirmPasswordLabel")}
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
        />

        <button
          disabled={isPending}
          type="submit"
          className="w-full py-4 mt-4 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white rounded-2xl text-title-3 shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>

      <footer className="mt-8 text-center">
        <p className="text-body-soft text-sm">
          {t("haveAccount")}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="text-primary font-bold ml-1.5 hover:text-primary-dark transition-colors"
          >
            {t("signIn")}
          </Link>
        </p>
      </footer>
    </div>
  );
}
