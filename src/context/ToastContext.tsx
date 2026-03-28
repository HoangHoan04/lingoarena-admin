import { Toast } from "primereact/toast";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef } from "react";

export type ToastContextType = {
  showToast: (options: {
    type?: "success" | "info" | "warn" | "error";
    title?: any;
    message?: any;
    timeout?: number;
  }) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  const showToast = ({
    type = "info",
    title,
    message,
    timeout = 3000,
  }: {
    type?: "success" | "info" | "warn" | "error";
    title?: any;
    message?: any;
    timeout?: number;
  }) => {
    toastRef.current?.show({
      severity: type,
      summary: title,
      detail: message,
      life: timeout,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toastRef} position="top-right" />
    </ToastContext.Provider>
  );
};
