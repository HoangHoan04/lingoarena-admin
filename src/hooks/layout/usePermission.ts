import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";

export const usePermission = () => {
  const { user } = useAuth();
  const hasPermission = useCallback(
    (requiredPermission?: string) => {
      if (!requiredPermission) return true;
      if (user?.isAdmin) return true;
      if (!user?.permissions?.length) return false;
      return user?.permissions?.includes(requiredPermission) ?? false;
    },
    [user],
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: string[]) => {
      if (user?.isAdmin) return true;
      if (!user?.permissions?.length) return false;
      return requiredPermissions.some((p) => user?.permissions?.includes(p));
    },
    [user],
  );

  return { hasPermission, hasAnyPermission };
};
