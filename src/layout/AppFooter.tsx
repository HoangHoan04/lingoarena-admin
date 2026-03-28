import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/context/TranslationContext";
import { type FC } from "react";

type AppFooterProps = {
  visible?: boolean;
  content?: string;
  showVersion?: boolean;
  showCopyright?: boolean;
};

const AppFooter: FC<AppFooterProps> = ({
  visible = true,
  content = "",
  showVersion = true,
  showCopyright = true,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!visible) return null;

  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();
  const defaultContent = content || t("footer.systemName");

  return (
    <footer
      className={`
        mt-auto transition-all duration-300 ease-in-out border-t
        ${
          isDark
            ? "bg-linear-to-r from-[#1a1a1a] to-[#262626] border-[#404040]"
            : "bg-linear-to-r from-[#ffffff] to-[#f8fafc] border-[#e0e6ed]"
        }
      `}
    >
      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-local-left { animation: fadeInLeft 0.5s ease-in-out; }
        .animate-local-right { animation: fadeInRight 0.5s ease-in-out; }
      `}</style>

      <div className="px-3 py-2 sm:px-4 md:py-3">
        <div
          className={`
          flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4
          text-xs md:text-[13px]
          ${isDark ? "text-[#b0b0b0]" : "text-[#666]"}
        `}
        >
          <div className="flex items-center gap-2 font-medium animate-local-left">
            <i className="pi pi-home text-[#1890ff] text-base transition-transform hover:scale-110"></i>
            <span>{defaultContent}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-end animate-local-right">
            {showVersion && (
              <span className={`flex items-center gap-1 opacity-80`}>
                <i className="pi pi-info-circle text-[#1890ff] text-[10px]"></i>
                <span>{t("footer.version")}</span>
              </span>
            )}

            {showCopyright && (
              <span className="opacity-80">
                © {currentYear} {t("footer.copyright")}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
