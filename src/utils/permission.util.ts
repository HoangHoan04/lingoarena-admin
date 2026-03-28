import { ROUTES } from "@/common/constants";

const MODULE_MAPPING: Record<string, string> = {
  EMPLOYEE_MANAGER: "EMPLOYEE",
  COMPANY_MANAGER: "COMPANY",
  BRANCH_MANAGER: "BRANCH",
  DEPARTMENT: "DEPARTMENT",
  DEPARTMENT_TYPE: "DEPARTMENT_TYPE",
  PART: "PART",
  PART_MASTER: "PART_MASTER",
  POSITION: "POSITION",
  POSITION_MASTER: "POSITION_MASTER",
  ROLE_MANAGER: "ROLE",
  PERMISSION_MANAGER: "PERMISSION",
  SHIFT: "SHIFT",
  SHIFT_SHEDULE: "SHIFT_SCHEDULE",
  ASSIGN_PERMISSION: "ASSIGN_PERMISSION",
};

interface ModuleOption {
  code: string;
  name: string;
}

const extractModulesFromRoutes = (
  routes: any,
  modules: Map<string, ModuleOption> = new Map(),
): ModuleOption[] => {
  if (!routes || typeof routes !== "object") return [];

  Object.entries(routes).forEach(([key, value]: [string, any]) => {
    if (value.isShow === false) return;
    if (value.path && value.label) {
      const hasVisibleChildren =
        value.children &&
        Object.values(value.children).some(
          (child: any) => child.isShow !== false,
        );

      if (!hasVisibleChildren) {
        const moduleCode = MODULE_MAPPING[key] || key.toUpperCase();
        if (!modules.has(moduleCode)) {
          modules.set(moduleCode, {
            code: moduleCode,
            name: value.label,
          });
        }
      }
    }

    if (value.children) {
      extractModulesFromRoutes(value.children, modules);
    }
  });

  return Array.from(modules.values());
};

export const getModuleOptions = (): ModuleOption[] => {
  const modules = extractModulesFromRoutes(ROUTES.MAIN);
  return modules.sort((a, b) => a.name.localeCompare(b.name, "vi"));
};

export const getModuleName = (code: string): string => {
  const modules = getModuleOptions();
  const module = modules.find((m) => m.code === code);
  return module?.name || code;
};

export const isValidPermissionCode = (code: string): boolean => {
  const pattern = /^[A-Z_]+:[A-Z_]+$/;
  return pattern.test(code);
};
