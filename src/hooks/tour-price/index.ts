import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { TourPriceFilterDto } from "@/dto/tour-price.dto";
import type {
  CreateTourPriceDto,
  TourPriceDto,
  UpdateTourPriceDto,
} from "@/dto/tour-price.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationTourPrice = (
  params: PaginationDto<TourPriceFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<TourPriceDto>
  >({
    queryKey: [API_ENDPOINTS.TOUR_PRICE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TOUR_PRICE.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useTourPriceDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<TourPriceDto>({
    queryKey: [API_ENDPOINTS.TOUR_PRICE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.TOUR_PRICE.FIND_BY_ID,
        {
          id,
        },
      );
      // API trả về trực tiếp tour object hoặc có thể wrap trong SuccessResponse
      const tourData = (res as any)?.data || res;
      return tourData as TourPriceDto;
    },
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateTourPrice = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createTour, isPending } = useMutation({
    mutationFn: (body: CreateTourPriceDto) =>
      rootApiService.post(
        API_ENDPOINTS.TOUR_PRICE.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_PRICE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_PRICE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo tour thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo tour",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.TOUR_PRICE.PAGINATION],
    });
  };

  return { onCreateTourPrice: createTour, isLoading: isPending, refetch };
};
export const useUpdateTourPrice = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateTourPrice, isPending } = useMutation({
    mutationFn: (data: UpdateTourPriceDto) => {
      return rootApiService.post(
        API_ENDPOINTS.TOUR_PRICE.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_PRICE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_PRICE.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_PRICE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật tour thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật tour",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateTourPrice: updateTourPrice, isLoading: isPending };
};
export const useActivateTourPrice = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateTourPrice, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TOUR_PRICE.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_PRICE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_PRICE.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt tour thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi kích hoạt tour",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onActivateTourPrice,
    isLoading,
  };
};
export const useDeactivateTourPrice = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateTourPrice, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TOUR_PRICE.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_PRICE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_PRICE.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động tour thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi ngừng hoạt động tour",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    isLoading,
    onDeactivateTourPrice,
  };
};
export const useTourPriceSelectBox = () => {
  const { data, isLoading, error } = useQuery<TourPriceDto[]>({
    queryKey: [API_ENDPOINTS.TOUR_PRICE.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TOUR_PRICE.SELECT_BOX) as Promise<
        TourPriceDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

// export const usePaginationTourPrice = (
//   params: PaginationDto<TourPriceFilterDto>,
// ) => {
//   const { data, isLoading, refetch, error } = useQuery<
//     PageResponse<TourPriceDto>
//   >({
//     queryKey: [API_ENDPOINTS.TOUR_PRICE.PAGINATION, params],
//     queryFn: () =>
//       rootApiService.post(API_ENDPOINTS.TOUR_PRICE.PAGINATION, params),
//   });

//   return {
//     data: data?.data || [],
//     total: data?.total || 0,
//     isLoading,
//     refetch,
//     error,
//   };
// };

export const useTourPrice = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<TourPriceDto>
  >({
    queryKey: [API_ENDPOINTS.TOUR_PRICE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.TOUR_PRICE.FIND_BY_ID,
        {
          id,
        },
      );
      return res as SuccessResponse<TourPriceDto>;
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
