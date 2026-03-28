export type RouteNode = {
  key: string;
  label: string;
  translationKey?: string;
  path?: string;
  icon?: string;
  parent?: string;
  parentKey?: string;
  isShow?: boolean;
  permission?: string;
};

export type RouteConfig = Record<string, any>;

const MAX_MENU_DEPTH = 3;

export const buildRouteTree = (
  routes: RouteConfig,
  parentKey?: string
): Record<string, RouteNode> => {
  const tree: Record<string, RouteNode> = {};

  const traverse = (
    obj: RouteConfig,
    parentPath = "",
    parentKeyVal?: string
  ) => {
    Object.values(obj).forEach((item: any) => {
      if (item.key) {
        const nodeKey = item.key;
        tree[nodeKey] = {
          key: item.key,
          label: item.label,
          translationKey: item.translationKey,
          path: item.path,
          icon: item.icon,
          parent: parentPath || undefined,
          parentKey: parentKeyVal,
          isShow: item.isShow ?? true,
        };
      }

      if (item.children) {
        traverse(item.children, item.path || parentPath, item.key);
      }
    });
  };

  traverse(routes, "", parentKey);
  return tree;
};

export const getTabbableRoutes = (routes: RouteConfig): RouteNode[] => {
  const result: RouteNode[] = [];

  const traverse = (obj: RouteConfig, parentKey?: string) => {
    Object.values(obj).forEach((item: any) => {
      if (item.path && !item.path.includes(":") && item.key) {
        result.push({
          key: item.key,
          label: item.label,
          translationKey: item.translationKey,
          path: item.path,
          icon: item.icon,
          parentKey,
          isShow: item.isShow ?? true,
        });
      }

      if (item.children) {
        traverse(item.children, item.key);
      }
    });
  };

  traverse(routes);
  return result;
};

export const findRouteByKey = (
  routes: RouteConfig,
  key: string
): any | null => {
  const search = (searchObj: any): any => {
    for (const value of Object.values(searchObj)) {
      const item = value as any;
      if (item.key === key) return item;
      if (item.children) {
        const result = search(item.children);
        if (result) return result;
      }
    }
    return null;
  };
  return search(routes);
};

export const findRouteByPath = (
  routes: RouteConfig,
  path: string,
  parentKey?: string
): any | null => {
  let result = null;

  const traverse = (obj: RouteConfig, parentKeyVal?: string) => {
    Object.values(obj).forEach((item: any) => {
      if (item.path === path) {
        result = { ...item, parentKey: parentKeyVal };
        return;
      }
      if (item.children) {
        traverse(item.children, item.key);
      }
    });
  };

  traverse(routes, parentKey);
  return result;
};

export const getAllRoutePatterns = (routes: RouteConfig): string[] => {
  const patterns: string[] = [];

  const traverse = (obj: RouteConfig) => {
    Object.values(obj).forEach((item: any) => {
      if (item.path) {
        patterns.push(item.path);
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(routes);
  return patterns;
};

export const matchPathToPattern = (
  pathname: string,
  pattern: string
): boolean => {
  const pathParts = pathname.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);

  if (pathParts.length !== patternParts.length) return false;

  return pathParts.every((part, idx) => {
    const patternPart = patternParts[idx];
    return patternPart === part || patternPart.startsWith(":");
  });
};

export const findMatchingRoutePattern = (
  pathname: string,
  routes: RouteConfig
): any | null => {
  let bestMatch: any = null;
  let maxDepth = -1;

  const traverse = (obj: RouteConfig, depth: number, parentKey?: string) => {
    Object.values(obj).forEach((item: any) => {
      if (item.path) {
        const isMatch = matchPathToPattern(pathname, item.path);

        if (isMatch) {
          const hasNoChildren =
            !item.children || Object.keys(item.children).length === 0;

          if (depth > maxDepth || (depth === maxDepth && hasNoChildren)) {
            bestMatch = { ...item, parentKey };
            maxDepth = depth;
          }
        }
      }

      if (item.children) {
        traverse(item.children, depth + 1, item.key);
      }
    });
  };

  traverse(routes, 0);
  return bestMatch;
};

export const convertRoutesToMenuItems = (
  routes: RouteConfig,
  hasPermission: (permission?: string) => boolean,
  translateFn?: (key: string) => string,
  _parentKey?: string,
  currentDepth: number = 1
): any[] => {
  const items: any[] = [];
  if (currentDepth > 4) return items;

  Object.values(routes).forEach((item: any) => {
    const isShow = item.isShow ?? true;
    const canAccess = hasPermission(item.permission);

    if (item.key && isShow && canAccess) {
      const menuItem: any = {
        key: item.key,
        label:
          translateFn && item.translationKey
            ? translateFn(item.translationKey)
            : item.label,
        icon: item.icon,
        isShow: item.isShow,
        permission: item.permission,
        translationKey: item.translationKey,
      };

      if (item.path && !item.path.includes(":")) {
        menuItem.path = item.path;
      }

      if (
        item.children &&
        Object.keys(item.children).length > 0 &&
        currentDepth < 3
      ) {
        const childItems = convertRoutesToMenuItems(
          item.children,
          hasPermission,
          translateFn,
          item.key,
          currentDepth + 1
        );

        if (childItems.length > 0) {
          menuItem.items = childItems;
        } else {
          if (!menuItem.path) {
            return;
          }
        }
      }

      items.push(menuItem);
    }
  });

  return items;
};

export const getVisibleRoutes = (routes: RouteConfig): RouteNode[] => {
  const result: RouteNode[] = [];

  const traverse = (
    obj: RouteConfig,
    depth: number = 1,
    parentKey?: string
  ) => {
    if (depth > MAX_MENU_DEPTH) return;

    Object.values(obj).forEach((item: any) => {
      const isShow = item.isShow ?? true;

      if (item.key && isShow) {
        result.push({
          key: item.key,
          label: item.label,
          translationKey: item.translationKey,
          path: item.path,
          icon: item.icon,
          parentKey,
          isShow: item.isShow,
        });

        if (item.children) {
          traverse(item.children, depth + 1, item.key);
        }
      }
    });
  };

  traverse(routes);
  return result;
};
