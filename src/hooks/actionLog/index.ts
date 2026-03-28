import type { PageRequest, PageResponse } from "@/dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export interface ActionLogFilter {
  functionType: string;
  functionId: string;
  type?: string;
  createdBy?: string;
}

export const ActionType = {
  CREATE: "action_log.type.create",
  UPDATE: "action_log.type.update",
  DELETE: "action_log.type.delete",
  CANCEL: "action_log.type.cancel",
  APPROVE: "action_log.type.approve",
  DEACTIVE: "action_log.type.deactive",
  ACTIVE: "action_log.type.active",
} as const;

export interface ActionLogDto {
  id: string;
  createdAt: Date;
  createdByName: string;
  employeeCode: string;
  type: keyof typeof ActionType;
  description: string;
  functionType: string;
  functionId: string;
}

export const useActionsLogPagination = (
  params: PageRequest<ActionLogFilter>
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ACTION_LOG, params],
    queryFn: async () => {
      const response = await rootApiService.post<PageResponse<ActionLogDto>>(
        API_ENDPOINTS.ACTION_LOG,
        params
      );
      return response;
    },
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};
