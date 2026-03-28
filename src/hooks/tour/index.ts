import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  BannerDto,
  BannerFilterDto,
  CreateBannerDto,
  UpdateBannerDto,
} from "@/dto/banner.dto";
import type {
  CreateTourDto,
  TourDto,
  TourFilterDto,
  UpdateTourDto,
} from "@/dto/tour.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationTour = (params: PaginationDto<TourFilterDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<TourDto>>({
    queryKey: [API_ENDPOINTS.TOUR.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.TOUR.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useTourDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<TourDto>({
    queryKey: [API_ENDPOINTS.TOUR.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.TOUR.FIND_BY_ID, {
        id,
      });
      // API trả về trực tiếp tour object hoặc có thể wrap trong SuccessResponse
      const tourData = (res as any)?.data || res;
      return tourData as TourDto;
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

export const useCreateTour = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createTour, isPending } = useMutation({
    mutationFn: (body: CreateTourDto) =>
      rootApiService.post(
        API_ENDPOINTS.TOUR.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.SELECT_BOX],
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
      queryKey: [API_ENDPOINTS.TOUR.PAGINATION],
    });
  };

  return { onCreateTour: createTour, isLoading: isPending, refetch };
};
export const useUpdateTour = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateTour, isPending } = useMutation({
    mutationFn: (data: UpdateTourDto) => {
      return rootApiService.post(
        API_ENDPOINTS.TOUR.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.SELECT_BOX],
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

  return { onUpdateTour: updateTour, isLoading: isPending };
};
export const useActivateTour = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateTour, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.TOUR.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.SELECT_BOX],
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
    onActivateTour,
    isLoading,
  };
};
export const useDeactivateTour = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateTour, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.TOUR.DEACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR.SELECT_BOX],
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
    onDeactivateTour,
  };
};
export const useTourSelectBox = () => {
  const { data, isLoading, error } = useQuery<TourDto[]>({
    queryKey: [API_ENDPOINTS.TOUR.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TOUR.SELECT_BOX) as Promise<TourDto[]>,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

export const usePaginationBanner = (params: PaginationDto<BannerFilterDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<BannerDto>>(
    {
      queryKey: [API_ENDPOINTS.BANNER.PAGINATION, params],
      queryFn: () =>
        rootApiService.post(API_ENDPOINTS.BANNER.PAGINATION, params),
    },
  );

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useBannerDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<BannerDto>
  >({
    queryKey: [API_ENDPOINTS.BANNER.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.BANNER.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<BannerDto>;
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

export const useCreateBanner = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createBanner, isPending } = useMutation({
    mutationFn: (body: CreateBannerDto) =>
      rootApiService.post(
        API_ENDPOINTS.BANNER.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo banner thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo banner",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.BANNER.PAGINATION],
    });
  };

  return { onCreateBanner: createBanner, isLoading: isPending, refetch };
};
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateBanner, isPending } = useMutation({
    mutationFn: (data: UpdateBannerDto) => {
      return rootApiService.post(
        API_ENDPOINTS.BANNER.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật banner thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật banner",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateBanner: updateBanner, isLoading: isPending };
};
export const useActivateBanner = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateBanner, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.BANNER.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Kích hoạt banner thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi kích hoạt banner",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onActivateBanner,
    isLoading,
  };
};
export const useDeactivateBanner = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateBanner, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.BANNER.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BANNER.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BANNER.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động banner thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi ngừng hoạt động banner",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    },
  );

  return {
    isLoading,
    onDeactivateBanner,
  };
};
export const useBannerSelectBox = () => {
  const { data, isLoading, error } = useQuery<BannerDto[]>({
    queryKey: [API_ENDPOINTS.BANNER.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.BANNER.SELECT_BOX) as Promise<
        BannerDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
