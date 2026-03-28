import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/context/TranslationContext";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import screenfull from "screenfull";

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleChange = () => {
    setIsFullscreen(screenfull.isFullscreen);
  };

  const handleToggle = () => {
    if (!screenfull.isEnabled) {
      showToast({
        type: "warn",
        title: t("fullscreen.toast.title"),
        message: t("fullscreen.toast.notSupported"),
        timeout: 2000,
      });
      return;
    }
    screenfull.toggle();
  };

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", handleChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", handleChange);
      }
    };
  }, []);

  const title = isFullscreen
    ? t("fullscreen.exitFullscreen")
    : t("fullscreen.enterFullscreen");

  return (
    <>
      <Tooltip target=".fullscreen-btn" content={title} position="bottom" />
      <Button
        icon={isFullscreen ? "pi pi-window-minimize" : "pi pi-window-maximize"}
        onClick={handleToggle}
        className="fullscreen-btn w-10 h-10 rounded-full p-2 flex items-center justify-center transition-colors duration-200 cursor-pointer "
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          color: "var(--text-color-secondary, #555)",
        }}
        text
      />
    </>
  );
};

export default FullScreen;
