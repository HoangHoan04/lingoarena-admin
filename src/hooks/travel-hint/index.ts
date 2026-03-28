import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateTravelHintDto,
  TravelHintDto,
  TravelHintFilterDto,
  UpdateTravelHintDto,
} from "@/dto/travel-hint.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationTravelHint = (
  params: PaginationDto<TravelHintFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<TravelHintDto>
  >({
    queryKey: [API_ENDPOINTS.TRAVEL_HINT.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TRAVEL_HINT.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useTravelHintDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<TravelHintDto>
  >({
    queryKey: [API_ENDPOINTS.TRAVEL_HINT.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.TRAVEL_HINT.FIND_BY_ID,
        {
          id,
        },
      );
      return res as SuccessResponse<TravelHintDto>;
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

export const useCreateTravelHint = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createTravelHint, isPending } = useMutation({
    mutationFn: (body: CreateTravelHintDto) =>
      rootApiService.post(
        API_ENDPOINTS.TRAVEL_HINT.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRAVEL_HINT.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo gợi ý thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo gợi ý",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.TRAVEL_HINT.PAGINATION],
    });
  };

  return {
    onCreateTravelHint: createTravelHint,
    isLoading: isPending,
    refetch,
  };
};
export const useUpdateTravelHint = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateTravelHint, isPending } = useMutation({
    mutationFn: (data: UpdateTravelHintDto) => {
      return rootApiService.post(
        API_ENDPOINTS.TRAVEL_HINT.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRAVEL_HINT.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRAVEL_HINT.FIND_BY_ID, variables.id],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật gợi ý thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật gợi ý",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateTravelHint: updateTravelHint, isLoading: isPending };
};
export const useActivateTravelHint = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateTravelHint, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TRAVEL_HINT.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TRAVEL_HINT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt gợi ý thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi kích hoạt gợi ý",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onActivateTravelHint,
    isLoading,
  };
};
export const useDeactivateTravelHint = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateTravelHint, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TRAVEL_HINT.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TRAVEL_HINT.PAGINATION],
        });

        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động gợi ý thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi ngừng hoạt động gợi ý",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    isLoading,
    onDeactivateTravelHint,
  };
};
