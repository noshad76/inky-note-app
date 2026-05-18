"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import {
  NotificationType,
  useNotificationStore,
} from "../store/use-notification-store";

const icons: Record<NotificationType, any> = {
  success: <CheckCircle2 className="w-5 h-5 text-success" />,
  error: <AlertCircle className="w-5 h-5 text-danger" />,
  info: <Info className="w-5 h-5 text-accent" />,
};

export const NotificationContainer = () => {
  const { notifications } = useNotificationStore();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((notif) => (
        <ToastItem key={notif.id} {...notif} />
      ))}
    </div>
  );
};

const ToastItem = ({ id, title, message, type }: any) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const remove = useNotificationStore((state) => state.removeNotification);

  useEffect(() => {
    const el = elementRef.current;
    gsap.fromTo(
      el,
      { x: 100, opacity: 0, scale: 0.9, filter: "blur(10px)" },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "back.out(1.7)",
      },
    );

    return () => {
      gsap.to(el, { opacity: 0, scale: 0.8, x: 50, duration: 0.3 });
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className="pointer-events-auto w-80 rounded-xl overflow-hidden relative group"
    >
      <div className="bg-surface/80  border border-border-soft p-4 rounded-xl shadow-lg flex items-start gap-3">
        <div
          className={`absolute inset-0 opacity-5 rounded-xl bg-gradient-to-r ${
            type === "success"
              ? "from-success"
              : type === "error"
                ? "from-danger"
                : "from-accent"
          } to-transparent`}
        />

        <div className="flex-shrink-0 mt-0.5">
          {icons[type as NotificationType]}
        </div>

        <div className="flex-grow min-w-0">
          <h4 className="text-sm font-bold text-text truncate">{title}</h4>
          <p className="text-xs text-text-soft mt-1 leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={() => remove(id)}
          className="flex-shrink-0 text-text-muted hover:text-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
