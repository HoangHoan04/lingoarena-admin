import { ROUTES } from "@/common/constants/routes";
import { usePermission } from "@/hooks/layout/usePermission";
import { useRouter } from "@/routers/hooks";
import { useEffect } from "react";

export const AuthGuard = ({
  children,
  requiredPermission,
}: {
  children: any;
  requiredPermission?: string;
}) => {
  const { hasPermission } = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push(ROUTES.MAIN.HOME.path);
    }
  }, [requiredPermission, hasPermission, router]);

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
};
