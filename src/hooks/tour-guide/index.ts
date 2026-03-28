import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateTourGuideDto,
  TourGuideDto,
  TourGuideFilterDto,
  UpdateTourGuideDto,
} from "@/dto/tour-guide.dto";
import { useRouter } from "@/routers/hooks";
import { EHttpHeaders } from "@/common/constants";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS, API_ROUTES } from "@/services/endpoint";
import tokenCache from "@/utils/token-cache";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationTourGuide = (
  params: PaginationDto<TourGuideFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<TourGuideDto>
  >({
    queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TOUR_GUIDE.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useTourGuideDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<TourGuideDto>
  >({
    queryKey: [API_ENDPOINTS.TOUR_GUIDE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.TOUR_GUIDE.FIND_BY_ID,
        {
          id,
        },
      );
      return res as SuccessResponse<TourGuideDto>;
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

export const useCreateTourGuide = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createTourGuide, isPending } = useMutation({
    mutationFn: (body: CreateTourGuideDto) =>
      rootApiService.post(
        API_ENDPOINTS.TOUR_GUIDE.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo khách hàng thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo khách hàng",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
    });
  };

  return { onCreateTourGuide: createTourGuide, isLoading: isPending, refetch };
};
export const useUpdateTourGuide = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateTourGuide, isPending } = useMutation({
    mutationFn: (data: UpdateTourGuideDto) => {
      return rootApiService.post(
        API_ENDPOINTS.TOUR_GUIDE.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật khách hàng thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật khách hàng",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateTourGuide: updateTourGuide, isLoading: isPending };
};
export const useActivateTourGuide = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateTourGuide, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TOUR_GUIDE.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt khách hàng thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi kích hoạt khách hàng",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onActivateTourGuide,
    isLoading,
  };
};
export const useDeactivateTourGuide = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateTourGuide, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TOUR_GUIDE.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động khách hàng thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message:
            error?.message || "Có lỗi xảy ra khi ngừng hoạt động khách hàng",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    isLoading,
    onDeactivateTourGuide,
  };
};
export const useTourGuideSelectBox = () => {
  const { data, isLoading, error } = useQuery<TourGuideDto[]>({
    queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX) as Promise<
        TourGuideDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

export const useImportTourGuideExcel = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: importTourGuideExcel, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return rootApiService.post(
        API_ENDPOINTS.TOUR_GUIDE.IMPORT_EXCEL,
        formData,
      ) as Promise<any>;
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TOUR_GUIDE.SELECT_BOX],
      });

      const total = Number(res?.total ?? 0);
      const success = Number(res?.success ?? 0);
      const failed = Number(res?.failed ?? 0);

      if (failed > 0) {
        showToast({
          type: "error",
          title: "Import thất bại",
          message: res?.message || `Import hoàn tất: ${success}/${total} thành công`,
          timeout: 6000,
        });
        return;
      }

      showToast({
        type: "success",
        title: "Thành công",
        message: res?.message || `Import hoàn tất: ${success}/${total} thành công`,
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Có lỗi xảy ra khi import hướng dẫn viên",
        timeout: 3000,
      });
    },
  });

  return {
    onImportTourGuideExcel: importTourGuideExcel,
    isLoading: isPending,
  };
};

function parseFilenameFromContentDisposition(value: string | null): string | null {
  if (!value) return null;

  // Examples:
  // - attachment; filename="file.xlsx"
  // - attachment; filename*=UTF-8''mau%20nhap.xlsx
  const filenameStar = value.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)?.[1];
  if (filenameStar) {
    try {
      return decodeURIComponent(filenameStar.replace(/(^"|"$)/g, ""));
    } catch {
      return filenameStar.replace(/(^"|"$)/g, "");
    }
  }

  const filename = value.match(/filename\s*=\s*("?)([^";]+)\1/i)?.[2];
  return filename || null;
}

export const useExportTourGuideExcel = () => {
  const { showToast } = useToast();

  const { mutateAsync: exportTourGuideExcel, isPending } = useMutation({
    mutationFn: async (body?: Record<string, any>) => {
      const token = tokenCache.getAccessToken();
      const res = await fetch(
        `${API_ROUTES.BASE_URL}${API_ENDPOINTS.TOUR_GUIDE.EXPORT_EXCEL}`,
        {
          method: "POST",
          headers: {
            ...(token ? { [EHttpHeaders.AUTHORIZATION]: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body ?? {}),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }

      const blob = await res.blob();
      const cd = res.headers.get("content-disposition");
      const filename =
        parseFilenameFromContentDisposition(cd) ||
        `tour-guide_${new Date().toISOString().slice(0, 10)}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return { filename };
    },
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Thành công",
        message: "Xuất Excel hướng dẫn viên thành công",
        timeout: 2500,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Có lỗi xảy ra khi xuất Excel hướng dẫn viên",
        timeout: 3000,
      });
    },
  });

  return {
    onExportTourGuideExcel: exportTourGuideExcel,
    isLoading: isPending,
  };
};


