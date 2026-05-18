import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  LoginPayload,
  LoginResponse,
  SignupPayload,
} from "../types/auth.types";
import { useNotificationStore } from "@/share/store/use-notification-store";
import { apiClient } from "@/lib/api/api-client";
import { authStorage } from "@/lib/storage/auth-storage";
import { APIROUTES } from "@/lib/constants/apiRoutes";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants/routes";
export const useLogin = () => {
  const t = useTranslations("auth");
  const addNotification = useNotificationStore((s) => s.addNotification);
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await apiClient.post<LoginResponse>(
        APIROUTES.auth.login,
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      authStorage.set({
        token: data.token,
        user: data.user,
        lastSync: null,
      });
      addNotification({
        type: "success",
        title: t("login.success"),
        message: t("login.successMessage"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || t("errors.defaultLogin");

      addNotification({
        type: "error",
        title: t("login.error"),
        message: errorMessage,
      });
    },
  });
};

export const useSignup = () => {
  const t = useTranslations("auth");
  const addNotification = useNotificationStore((s) => s.addNotification);
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: SignupPayload) => {
      const response = await apiClient.post<LoginResponse>(
        APIROUTES.auth.signup,
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      authStorage.set({
        token: data.token,
        user: data.user,
        lastSync: null,
      });
      addNotification({
        type: "success",
        title: t("signup.success"),
        message: t("signup.successMessage"),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || t("errors.defaultSignup");
      addNotification({
        type: "error",
        title: t("signup.error"),
        message: errorMessage,
      });
    },
  });
};
