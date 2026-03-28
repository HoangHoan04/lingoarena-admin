import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateTranslationDto,
  TranslationDto,
  TranslationFilterDto,
  UpdateTranslationDto,
} from "@/dto/translation.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationTranslation = (
  params: PaginationDto<TranslationFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<TranslationDto>
  >({
    queryKey: [API_ENDPOINTS.TRANSLATIONS.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TRANSLATIONS.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useFindTranslationByKey = (key: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<TranslationDto>
  >({
    queryKey: [API_ENDPOINTS.TRANSLATIONS.FIND_BY_KEY, key],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.TRANSLATIONS.FIND_BY_KEY,
        {
          key,
        },
      );
      return res as SuccessResponse<TranslationDto>;
    },
    enabled: !!key,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateTranslation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: createTranslation, isPending } = useMutation({
    mutationFn: (body: CreateTranslationDto) =>
      rootApiService.post(
        API_ENDPOINTS.TRANSLATIONS.CREATE,
        body,
      ) as Promise<SuccessResponse>,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRANSLATIONS.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Tạo bản dịch thành công",
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.TRANSLATIONS.PAGINATION],
    });
  };

  return {
    onCreateTranslation: createTranslation,
    isLoading: isPending,
    refetch,
  };
};

export const useUpdateTranslation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: updateTranslation, isPending } = useMutation({
    mutationFn: (data: UpdateTranslationDto) => {
      return rootApiService.post(
        API_ENDPOINTS.TRANSLATIONS.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRANSLATIONS.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Cập nhật bản dịch thành công",
      });
    },
  });

  return { onUpdateTranslation: updateTranslation, isLoading: isPending };
};

export const useDeleteTranslation = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: onDeleteTranslation, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TRANSLATIONS.DELETE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TRANSLATIONS.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: "Xóa bản dịch thành công",
        });
      },
    });

  return {
    onDeleteTranslation,
    isLoading,
  };
};
