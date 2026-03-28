import { ROUTES } from "@/common/constants/routes";
import { useConfig } from "@/context/ConfigContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/context/TranslationContext";
import { usePermission } from "@/hooks/layout/usePermission";
import { convertRoutesToMenuItems } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type AppSidebarProps = { collapsed: boolean };

type MenuItem = {
  key: string;
  path?: string;
  icon?: string;
  label: string;
  items?: MenuItem[];
  isShow?: boolean;
};

const checkIsActive = (item: MenuItem, currentPath: string): boolean => {
  if (
    item.path === ROUTES.MAIN.HOME.path &&
    currentPath !== ROUTES.MAIN.HOME.path
  )
    return false;
  if (item.path === currentPath) return true;
  if (item.path && currentPath.startsWith(item.path)) return true;
  if (item.items)
    return item.items.some((child) => checkIsActive(child, currentPath));
  return false;
};

const getAllChildKeys = (item: MenuItem): string[] => {
  const keys: string[] = [];
  if (item.items) {
    item.items.forEach((child) => {
      keys.push(child.key);
      if (child.items) {
        keys.push(...getAllChildKeys(child));
      }
    });
  }
  return keys;
};

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { settings } = useConfig();
  const { hasPermission } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const isDark = theme === "dark";
  const menuItems = useMemo(
    () => convertRoutesToMenuItems(ROUTES.MAIN, hasPermission, t),
    [hasPermission, t],
  );

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
      return;
    }
    const keysToExpand: string[] = [];
    const findParents = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (checkIsActive(item, location.pathname) && item.items) {
          keysToExpand.push(item.key);
          findParents(item.items);
        }
      });
    };
    findParents(menuItems);
    setOpenKeys((prev) => Array.from(new Set([...prev, ...keysToExpand])));
  }, [location.pathname, menuItems, collapsed]);

  const getParentKeys = (
    targetKey: string,
    items: MenuItem[],
    parents: string[] = [],
  ): string[] => {
    for (const item of items) {
      if (item.key === targetKey) {
        return parents;
      }
      if (item.items) {
        const found = getParentKeys(targetKey, item.items, [
          ...parents,
          item.key,
        ]);
        if (
          found.length > 0 ||
          item.items.some((child) => child.key === targetKey)
        ) {
          return [...parents, item.key];
        }
      }
    }
    return [];
  };

  const handleToggleSubmenu = (key: string, item?: MenuItem) => {
    setOpenKeys((prev) => {
      const isOpen = prev.includes(key);

      if (settings.sidebarAccordion) {
        if (isOpen) {
          const childKeys = item ? getAllChildKeys(item) : [];
          return prev.filter((k) => childKeys.includes(k));
        } else {
          const parentKeys = getParentKeys(key, menuItems);
          return [...parentKeys, key];
        }
      }

      return isOpen ? prev.filter((k) => k !== key) : [...prev, key];
    });
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.items && item.items.length > 0 && !collapsed) {
      handleToggleSubmenu(item.key, item);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderCollapsedPopup = (item: MenuItem) => {
    if (!item.items || item.items.length === 0) return null;

    const isRightSidebar = settings.sidebarPosition === "right";

    return (
      <div
        className={`absolute top-0 z-9999 animate-in fade-in duration-200 ${
          isRightSidebar
            ? "right-full pr-2 slide-in-from-right-2"
            : "left-full pl-2 slide-in-from-left-2"
        }`}
      >
        <div
          className={`flex flex-col rounded-xl py-2 min-w-55 border shadow-2xl 
          ${
            isDark
              ? "bg-[#262626] border-[#404040]"
              : "bg-white border-[#e0e6ed]"
          }`}
        >
          <div
            className={`px-4 py-2 mb-1 font-bold border-b text-[11px] tracking-wider uppercase opacity-50 
            ${
              isDark
                ? "border-[#404040] text-gray-400"
                : "border-[#eee] text-gray-500"
            }`}
          >
            {item.label}
          </div>
          <div className="flex flex-col gap-0.5 px-2">
            {item.items
              .filter((c) => c.isShow !== false)
              .map((child) => (
                <button
                  key={child.key}
                  onClick={() => child.path && navigate(child.path)}
                  className={`w-full flex items-center px-3 py-2 text-[13px] rounded-md transition-colors text-left
                  ${
                    checkIsActive(child, location.pathname)
                      ? "text-[#1890ff] bg-[#1890ff]/10 font-bold"
                      : isDark
                        ? "text-gray-300 hover:text-[#1890ff] hover:bg-white/5"
                        : "text-gray-700 hover:text-[#1890ff] hover:bg-black/5"
                  }`}
                >
                  {child.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items
      .filter((item) => item.isShow !== false)
      .map((item) => {
        const isActive = checkIsActive(item, location.pathname);
        const isOpen = openKeys.includes(item.key);
        const hasChildren = item.items && item.items.length > 0;
        const isHovered = hoveredKey === item.key;

        return (
          <div
            key={item.key}
            className="w-full relative group"
            onMouseEnter={() => collapsed && setHoveredKey(item.key)}
            onMouseLeave={() => collapsed && setHoveredKey(null)}
          >
            <div
              onClick={() => handleMenuClick(item)}
              className={`flex items-center gap-3 cursor-pointer rounded-lg transition-all duration-200 font-medium m-1
              ${
                collapsed ? "justify-center p-2.5" : "justify-start px-5 py-2.5"
              }
              ${
                isActive
                  ? isDark
                    ? "bg-[#1890ff]/15 text-[#1890ff] font-semibold"
                    : "bg-[#cfe8ff] text-[#1890ff] font-semibold"
                  : isDark
                    ? "text-[#b0b0b0] hover:bg-[#1890ff]/10 hover:text-[#1890ff]"
                    : "text-[#666] hover:bg-[#1890ff]/05 hover:text-[#1890ff]"
              }
            `}
            >
              {settings.showSidebarIcon && item.icon && (
                <i
                  className={`${item.icon} text-[18px] shrink-0 ${
                    isActive ? "text-[#1890ff]" : ""
                  }`}
                />
              )}

              {!collapsed && (
                <span className="flex-1 truncate text-[13px]">
                  {item.label}
                </span>
              )}

              {hasChildren && !collapsed && (
                <i
                  className={`pi text-[11px] transition-transform duration-300 ${
                    isOpen ? "rotate-180 pi-chevron-up" : "pi-chevron-down"
                  }`}
                />
              )}

              {collapsed &&
                hasChildren &&
                isHovered &&
                renderCollapsedPopup(item)}
            </div>

            {hasChildren && isOpen && !collapsed && (
              <div
                className={`flex flex-col ml-4 mt-1 border-l transition-all duration-300 
              ${isDark ? "border-[#404040]" : "border-[#e0e6ed]"}`}
              >
                {renderMenuItems(item.items!)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div
      style={{
        width: collapsed
          ? `${settings.sidebarCollapsedWidth}px`
          : `${settings.sidebarWidth}px`,
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className={`flex flex-col h-screen scrollbar-none border-r z-50
        ${collapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"} 
        ${
          isDark
            ? "bg-[#1f1f1f] border-[#404040]"
            : "bg-[#e6f2ff] border-[#e0e6ed]"
        }
      `}
    >
      <div className="flex items-center justify-center h-15 p-4 shrink-0">
        <div
          className={`h-8 w-8 rounded-full transition-transform duration-300 hover:scale-110
            ${isDark ? "bg-white/10" : "bg-blue-500/20"}`}
        />
      </div>

      <div className="flex flex-col flex-1 p-2 gap-0">
        {renderMenuItems(menuItems)}
      </div>
    </div>
  );
}
