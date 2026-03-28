import { useConfig } from "@/context/ConfigContext";
import { useTheme } from "@/context/ThemeContext";
import { findMatchingRoutePattern } from "@/utils/route.util";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Tab = {
  id: string;
  label: string;
  path: string;
  icon?: string;
};

type AppTabHeaderProps = {
  routes: Record<string, any>;
};

const AppTabHeader = ({ routes }: AppTabHeaderProps) => {
  const { theme } = useTheme();
  const { settings } = useConfig();
  const location = useLocation();
  const navigate = useNavigate();
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);
  const [visibleTabs, setVisibleTabs] = useState<Tab[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<Menu>(null);

  const isDark = theme === "dark";
  const maxTabsSetting = settings.maxTabs || 10;
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedRoute = findMatchingRoutePattern(currentPath, routes);

    if (matchedRoute) {
      const tabId = matchedRoute.key;
      setActiveTab(tabId);
      setOpenTabs((prev) => {
        const exists = prev.find((tab) => tab.id === tabId);
        if (!exists) {
          const newTabs = [
            ...prev,
            {
              id: tabId,
              label: matchedRoute.label,
              path: currentPath,
              icon: matchedRoute.icon,
              translationKey: matchedRoute.translationKey,
            },
          ];
          return newTabs.length > maxTabsSetting
            ? newTabs.slice(-maxTabsSetting)
            : newTabs;
        }
        return prev.map((tab) =>
          tab.id === tabId ? { ...tab, path: currentPath } : tab,
        );
      });
    }
  }, [location.pathname, routes, maxTabsSetting]);

  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const controlsWidth = 80;
      const availableWidth = containerWidth - controlsWidth;
      const minTabWidth = 120;
      const maxPossibleVisible = Math.floor(availableWidth / minTabWidth);

      if (openTabs.length > maxPossibleVisible && maxPossibleVisible > 0) {
        setVisibleTabs(openTabs.slice(0, maxPossibleVisible - 1));
        setHiddenTabs(openTabs.slice(maxPossibleVisible - 1));
      } else {
        setVisibleTabs(openTabs);
        setHiddenTabs([]);
      }
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, [openTabs]);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((t) => t.id !== tabId);
    setOpenTabs(newTabs);
    if (activeTab === tabId && newTabs.length > 0) {
      const lastTab = newTabs[newTabs.length - 1];
      navigate(lastTab.path);
    } else if (newTabs.length === 0) {
      navigate("/");
    }
  };

  const overflowMenuItems: MenuItem[] = hiddenTabs.map((tab) => ({
    label: tab.label,
    icon: tab.icon || "pi pi-file",
    className: activeTab === tab.id ? "font-bold text-blue-500" : "",
    command: () => {
      setActiveTab(tab.id);
      navigate(tab.path);
    },
  }));

  if (!settings.showTabHeader || openTabs.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`flex items-end border-b transition-all duration-200 pt-2 px-2 gap-1
        ${
          isDark
            ? "border-[#333] bg-[#1f1f1f]"
            : "border-[#bdc1c6] bg-[#dee1e6]"
        }
      `}
    >
      <div className="flex items-end flex-1 overflow-hidden">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`group relative flex items-center gap-2 px-4 cursor-pointer transition-all duration-150 
                whitespace-nowrap min-w-25 max-w-50 flex-1 rounded-t-lg h-8.5 text-[12px]
                ${
                  isActive
                    ? isDark
                      ? "bg-[#2d2e31] text-white"
                      : "bg-white text-black shadow-sm"
                    : isDark
                      ? "text-gray-400 hover:bg-[#323234]"
                      : "text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              <span className="truncate flex-1">{tab.label}</span>
              <i
                className="pi pi-times hover:bg-gray-500/20 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleCloseTab(e, tab.id)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1 shrink-0 pb-2">
        {hiddenTabs.length > 0 && (
          <>
            <Menu
              model={overflowMenuItems}
              popup
              ref={menuRef}
              id="popup_menu"
            />
            <Button
              icon="pi pi-chevron-down"
              rounded
              text
              className={`w-8! h-8! p-0!  ${
                isDark ? "text-white" : "text-gray-700"
              }`}
              onClick={(e) => menuRef.current?.toggle(e)}
              tooltip={`${hiddenTabs.length} tab khác`}
              style={{
                background: "transparent",
                border: "none",
                boxShadow: "none",
              }}
            />
          </>
        )}

        <Button
          icon="pi pi-plus"
          rounded
          text
          className={`w-8! h-8! p-0! ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        />

        {openTabs.length > 1 && (
          <Button
            icon="pi pi-trash"
            rounded
            text
            className="w-8! h-8! p-0! text-red-500"
            onClick={() => {
              setOpenTabs([]);
              navigate("/");
            }}
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AppTabHeader;
