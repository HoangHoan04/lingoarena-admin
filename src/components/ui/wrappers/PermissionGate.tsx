import { usePermission } from "@/hooks/layout/usePermission";
import type { ReactNode } from "react";

interface Props {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = ({
  permission,
  children,
  fallback = null,
}: Props) => {
  const { hasPermission } = usePermission();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
