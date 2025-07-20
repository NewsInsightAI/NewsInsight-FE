import { useState, useCallback } from "react";

interface ToastState {
  isVisible: boolean;
  message: string;
  type: "success" | "loading" | "error" | "info";
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "info",
  });

  const showToast = useCallback(
    (message: string, type: ToastState["type"] = "info") => {
      setToast({
        isVisible: true,
        message,
        type,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string) => {
      showToast(message, "error");
    },
    [showToast]
  );

  const showLoading = useCallback(
    (message: string) => {
      showToast(message, "loading");
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => {
      showToast(message, "info");
    },
    [showToast]
  );

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showLoading,
    showInfo,
  };
};
