import { useToast } from "@/context/ToastContext";
import type {
  EmployeeDto,
  PageResponse,
  PaginationDto,
  SuccessResponse,
} from "@/dto";
import type {
  CreateRoleDto,
  RoleDto,
  RoleFilterDto,
  UpdateRoleDto,
} from "@/dto/role.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationRole = (params: PaginationDto<RoleFilterDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<RoleDto>>({
    queryKey: [API_ENDPOINTS.ROLE.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.ROLE.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useFindAllRoles = () => {
  const { data, isLoading, error, refetch } = useQuery<
    SuccessResponse<RoleDto[]>
  >({
    queryKey: [API_ENDPOINTS.ROLE.FIND_ALL],
    queryFn: () => rootApiService.post(API_ENDPOINTS.ROLE.FIND_ALL),
  });

  return { data: data?.data || [], isLoading, error, refetch };
};

export const useRoleDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<RoleDto>
  >({
    queryKey: [API_ENDPOINTS.ROLE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.ROLE.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<RoleDto>;
    },
    enabled: !!id,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateRole = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onCreateRole, isPending } = useMutation({
    mutationFn: (body: CreateRoleDto) =>
      rootApiService.post(
        API_ENDPOINTS.ROLE.CREATE,
        body,
      ) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.FIND_ALL],
      });
      showToast({ type: "success", message: res.message, title: "Thành công" });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message, title: "Lỗi" });
    },
  });

  return { onCreateRole, isPending };
};

export const useUpdateRole = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onUpdateRole, isPending } = useMutation({
    mutationFn: (body: UpdateRoleDto) =>
      rootApiService.post(
        API_ENDPOINTS.ROLE.UPDATE,
        body,
      ) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.FIND_ALL],
      });
      showToast({ type: "success", message: res.message, title: "Thành công" });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message, title: "Lỗi" });
    },
  });

  return { onUpdateRole, isPending };
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteRole, isPending } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.ROLE.DEACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.FIND_ALL],
      });
      showToast({ type: "success", message: res.message, title: "Thành công" });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message, title: "Lỗi" });
    },
  });

  return { onDeleteRole, isPending };
};

export const useRoleSelectBox = () => {
  const { data, isLoading, error } = useQuery<RoleDto[]>({
    queryKey: [API_ENDPOINTS.ROLE.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.ROLE.SELECT_BOX) as Promise<RoleDto[]>,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

export const useAssignPermissions = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onAssignPermissions, isPending } = useMutation({
    mutationFn: (body: { roleId: string; permissionIds: string[] }) =>
      rootApiService.post(
        API_ENDPOINTS.ROLE.ASSIGN_PERMISSIONS,
        body,
      ) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.FIND_BY_ID],
      });
      showToast({
        type: "success",
        message: res.message,
        title: "Thành công",
      });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message, title: "Lỗi" });
    },
  });

  return { onAssignPermissions, isPending };
};

export const useEmployeesByRole = () => {
  const { showToast } = useToast();

  const { mutateAsync: getEmployees, isPending: isLoading } = useMutation({
    mutationFn: (roleId: string) =>
      rootApiService.post(API_ENDPOINTS.ROLE.FIND_EMPLOYEES_BY_ROLE, {
        roleId,
      }) as Promise<SuccessResponse<EmployeeDto[]>>,
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message,
        title: "Lỗi tải nhân viên",
      });
    },
  });

  return { getEmployees, isLoading };
};
