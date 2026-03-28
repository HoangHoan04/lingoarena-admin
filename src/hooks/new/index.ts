import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateNewDto,
  NewDto,
  NewFilterDto,
  UpdateNewDto,
} from "@/dto/new.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationNew = (params: PaginationDto<NewFilterDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<NewDto>>({
    queryKey: [API_ENDPOINTS.NEWS.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.NEWS.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useNewDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<NewDto>>(
    {
      queryKey: [API_ENDPOINTS.NEWS.FIND_BY_ID, id],
      queryFn: async () => {
        const res = await rootApiService.post(API_ENDPOINTS.NEWS.FIND_BY_ID, {
          id,
        });
        return res as SuccessResponse<NewDto>;
      },
      enabled: !!id,
    },
  );

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateNew = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createNew, isPending } = useMutation({
    mutationFn: (body: CreateNewDto) =>
      rootApiService.post(
        API_ENDPOINTS.NEWS.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo tin tức thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo tin tức",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.NEWS.PAGINATION],
    });
  };

  return { onCreateNew: createNew, isLoading: isPending, refetch };
};
export const useUpdateNew = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateNew, isPending } = useMutation({
    mutationFn: (data: UpdateNewDto) => {
      return rootApiService.post(
        API_ENDPOINTS.NEWS.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật tin tức thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật tin tức",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateNew: updateNew, isLoading: isPending };
};
export const useActivateNew = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateNew, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.NEWS.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Kích hoạt tin tức thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi kích hoạt tin tức",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onActivateNew,
    isLoading,
  };
};
export const useDeactivateNew = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateNew, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.NEWS.DEACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NEWS.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Ngừng hoạt động tin tức thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi ngừng hoạt động tin tức",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    isLoading,
    onDeactivateNew,
  };
};
export const useNewSelectBox = () => {
  const { data, isLoading, error } = useQuery<NewDto[]>({
    queryKey: [API_ENDPOINTS.NEWS.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.NEWS.SELECT_BOX) as Promise<NewDto[]>,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
