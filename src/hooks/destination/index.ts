import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateDestinationDto,
  DestinationDto,
  DestinationFilterDto,
  UpdateDestinationDto,
} from "@/dto/destination.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationDestination = (
  params: PaginationDto<DestinationFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<DestinationDto>
  >({
    queryKey: [API_ENDPOINTS.DESTINATION.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.DESTINATION.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useDestinationDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<DestinationDto>
  >({
    queryKey: [API_ENDPOINTS.DESTINATION.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.DESTINATION.FIND_BY_ID,
        {
          id,
        },
      );
      return res as SuccessResponse<DestinationDto>;
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

export const useCreateDestination = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createDestination, isPending } = useMutation({
    mutationFn: (body: CreateDestinationDto) =>
      rootApiService.post(
        API_ENDPOINTS.DESTINATION.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DESTINATION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DESTINATION.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo điểm đến thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo điểm đến",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.DESTINATION.PAGINATION],
    });
  };

  return {
    onCreateDestination: createDestination,
    isLoading: isPending,
    refetch,
  };
};
export const useUpdateDestination = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateDestination, isPending } = useMutation({
    mutationFn: (data: UpdateDestinationDto) => {
      return rootApiService.post(
        API_ENDPOINTS.DESTINATION.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DESTINATION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DESTINATION.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DESTINATION.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật điểm đến thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật điểm đến",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateDestination: updateDestination, isLoading: isPending };
};
export const useActivateDestination = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateDestination, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.DESTINATION.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DESTINATION.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DESTINATION.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt điểm đến thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi kích hoạt điểm đến",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onActivateDestination,
    isLoading,
  };
};

export const useDeactivateDestination = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateDestination, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.DESTINATION.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DESTINATION.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.DESTINATION.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động điểm đến thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message:
            error?.message || "Có lỗi xảy ra khi ngừng hoạt động điểm đến",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    isLoading,
    onDeactivateDestination,
  };
};

export const useDestinationSelectBox = () => {
  const { data, isLoading, error } = useQuery<DestinationDto[]>({
    queryKey: [API_ENDPOINTS.DESTINATION.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.DESTINATION.SELECT_BOX) as Promise<
        DestinationDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

export const useGetTourByDestination = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<DestinationDto>
  >({
    queryKey: [API_ENDPOINTS.DESTINATION.GET_TOUR_BY_DESTINATION, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.DESTINATION.GET_TOUR_BY_DESTINATION,
        {
          id,
        },
      );
      return res as SuccessResponse<DestinationDto>;
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
