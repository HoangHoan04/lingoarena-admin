import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/context/TranslationContext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { type FC, useRef } from "react";
import Breadcrumbs from "../components/layout/Breadcrumb";
import FullScreen from "../components/layout/FullScreen";

type AppNavbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  showNotification?: boolean;
};

const AppNavbar: FC<AppNavbarProps> = ({
  collapsed,
  onToggleSidebar,
  onChangePassword,
  onLogout,
  onOpenSettings,
  showNotification = true,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const menuRef = useRef<Menu>(null);
  const isDark = theme === "dark";
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      label: t("navbar.changePassword"),
      icon: "pi pi-key",
      command: onChangePassword,
    },
    {
      label: t("navbar.logout"),
      icon: "pi pi-sign-out",
      command: onLogout,
    },
  ];

  const displayUserName = user?.employee?.fullName || user?.username || "Guest";

  const displayRole =
    user?.roles && user.roles.length > 0
      ? user.roles[0].name
      : user?.isAdmin
        ? "Administrator"
        : t("navbar.userRole");

  const getAvatarUrl = () => {
    if (user?.employee?.avatar) {
      const avatarData = Array.isArray(user.employee.avatar)
        ? user.employee.avatar[0]
        : user.employee.avatar;
      return (
        avatarData?.url ||
        "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
      );
    }
    return "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png";
  };

  const iconBtnClasses = `
    !w-6 !h-6 sm:!w-7 sm:!h-7 md:!w-8 md:!h-8 lg:!w-9 lg:!h-9 
    !p-0 !rounded-full !transition-all !duration-200 !border-none !shadow-none
    !text-[#1890ff] 
    ${
      isDark
        ? "hover:!bg-[#1890ff]/20 active:!bg-[#1890ff]/30"
        : "hover:!bg-[#1890ff]/10 active:!bg-[#1890ff]/20"
    }
    focus:!outline-none focus:!ring-2 focus:!ring-[#1890ff]/20
  `;

  return (
    <header
      className={`
        flex items-center px-3 py-2 sm:px-4 min-h-11 sm:min-h-12 md:min-h-14 z-10 transition-all duration-300 border-b
        ${
          isDark
            ? "bg-linear-to-r from-[#1f1f1f] to-[#2a2a2a] border-[#404040] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            : "bg-linear-to-r from-[#cfe8ff] to-[#e6f2ff] border-[#e0e6ed] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        }
      `}
    >
      <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 overflow-hidden">
          <Button
            icon={collapsed ? "pi pi-bars" : "pi pi-times"}
            onClick={onToggleSidebar}
            tooltip={collapsed ? t("navbar.openMenu") : t("navbar.closeMenu")}
            tooltipOptions={{ position: "bottom" }}
            className={iconBtnClasses}
            text
            style={{
              marginLeft: 5,
            }}
          />
          <div className="hidden sm:block">
            <Breadcrumbs theme={theme} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <FullScreen />
          {/* {showNotification && <Notification />} */}

          <Button
            icon="pi pi-cog"
            onClick={onOpenSettings}
            tooltip={t("navbar.settings")}
            tooltipOptions={{ position: "bottom" }}
            className={iconBtnClasses}
            text
          />

          <Menu
            model={menuItems}
            popup
            ref={menuRef}
            className={`border! rounded-lg! py-0! top-[60.1px]! mt-0! `}
            pt={{
              menuitem: { className: "my-1 p-0" },
              action: () => ({
                className: `
                  flex items-center gap-3  py-2.5 mx-2 rounded-md text-[13px] font-medium 
                  hover:!text-[#1890ff]
                `,
              }),
              icon: () => ({
                className: `!text-base transition-colors `,
              }),
              separator: {
                className: `!h-[1px] !my-1 ${
                  isDark ? "!bg-[#404040]" : "!bg-[#e0e6ed]"
                }`,
              },
            }}
          />

          <div
            className={
              "flex items-center gap-2.5 px-2 py-1 rounded-full cursor-pointer transition-all duration-200"
            }
            onClick={(e) => {
              e.stopPropagation();
              menuRef.current?.toggle(e);
            }}
          >
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span
                className={`text-[13px] font-bold ${
                  isDark ? "text-white" : "text-[#262626]"
                }`}
              >
                {displayUserName}
              </span>
              <span
                className={`text-[10px] opacity-60 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {displayRole}
              </span>
            </div>

            <Avatar
              image={getAvatarUrl()}
              shape="circle"
              className={`
                w-7! h-7! sm:w-8! sm:h-8! md:w-9! md:h-9!
                border-2! border-[#1890ff]! shadow-[0_2px_8px_rgba(24,144,255,0.2)]!
              `}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
