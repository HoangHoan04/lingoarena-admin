import { ROUTES } from "@/common/constants/routes";
import BackToTop from "@/components/layout/BackToTop";
import ConfigSetting from "@/components/layout/ConfigSetting";
import AppTabHeader from "@/components/layout/TabHeader";
import { ChangePasswordModal } from "@/components/ui/change-password/ChangePassword";
import { useAuth } from "@/context/AuthContext";
import { ConfigProvider, useConfig } from "@/context/ConfigContext";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "@/context/TranslationContext";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppFooter from "./AppFooter";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";

function AppLayoutContent() {
  const { settings, footerSettings } = useConfig();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [changePassVisible, setChangePassVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    const appLayout = document.querySelector(".app-layout");
    if (appLayout) {
      if (settings.sidebarPosition === "right") {
        appLayout.classList.add("flex-row-reverse");
      } else {
        appLayout.classList.remove("flex-row-reverse");
      }
    }
  }, [settings.sidebarPosition]);

  useEffect(() => {
    const root = document.documentElement;
    if (!settings.showTabHeader) {
      root.classList.add("tab-header-hidden");
    } else {
      root.classList.remove("tab-header-hidden");
    }
  }, [settings.showTabHeader]);

  return (
    <div
      className={`flex h-lvh overflow-hidden app-layout ${
        settings.sidebarPosition === "right" ? "flex-row-reverse" : ""
      }`}
    >
      <div className={`${collapsed ? "overflow-visible" : ""} z-50`}>
        <AppSidebar collapsed={collapsed} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <AppNavbar
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          onChangePassword={() => setChangePassVisible(true)}
          onLogout={handleLogout}
          onOpenSettings={() => setSettingsVisible(true)}
          showNotification={settings.notifications}
        />

        {settings.showTabHeader && <AppTabHeader routes={ROUTES.MAIN} />}

        <main className="main-layout flex-1 overflow-hidden">
          <Outlet />
        </main>

        <AppFooter
          visible={footerSettings.showFooter}
          content={footerSettings.footerContent}
          showVersion={footerSettings.showVersion}
          showCopyright={footerSettings.showCopyright}
        />
      </div>

      <ChangePasswordModal
        visible={changePassVisible}
        onHide={() => setChangePassVisible(false)}
      />

      <ConfigSetting
        visible={settingsVisible}
        onHide={() => setSettingsVisible(false)}
      />

      <BackToTop />
    </div>
  );
}

export default function AppLayout() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleAutoLogout = async () => {
    showToast({
      type: "warn",
      title: t("settings.auto_logout_title") || "Tự động đăng xuất",
      message:
        t("settings.auto_logout_message") ||
        "Bạn đã bị đăng xuất do không hoạt động",
      timeout: 3000,
    });

    await logout();
  };

  return (
    <ConfigProvider onAutoLogout={handleAutoLogout}>
      <AppLayoutContent />
    </ConfigProvider>
  );
}
