import { useToast } from "@/context/ToastContext";
import type { PageResponse, SuccessResponse } from "@/dto";
import type {
  NotificationCountResponse,
  NotificationCreateDto,
  NotificationItem,
  NotificationPaginationDto,
  NotificationSettingDto,
  NotificationUpdateDto,
  UpdateNotificationSettingDto,
} from "@/dto/notification.dto";

import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationNotification = (
  params: NotificationPaginationDto,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<NotificationItem>
  >({
    queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.PAGINATION, params),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useUnreadCount = () => {
  const { data, isLoading, refetch } = useQuery<NotificationCountResponse>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD],
    queryFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD),
    refetchInterval: 60000,
  });

  return {
    count: data?.countAll || 0,
    isLoading,
    refetch,
  };
};

export const useMarkReadList = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onMarkReadList, isPending } = useMutation({
    mutationFn: (ids: string[]) =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.MARK_READ_LIST, {
        lstId: ids,
      }) as Promise<SuccessResponse>,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD],
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onMarkReadList, isLoading: isPending };
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onMarkAllRead, isPending } = useMutation({
    mutationFn: () =>
      rootApiService.post(
        API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ,
      ) as Promise<SuccessResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD],
      });

      showToast({
        type: "success",
        message: res.message || "Đã đánh dấu tất cả là đã đọc",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onMarkAllRead, isLoading: isPending };
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onCreate, isPending } = useMutation({
    mutationFn: (data: NotificationCreateDto) =>
      rootApiService.post(
        API_ENDPOINTS.NOTIFICATION.CREATE,
        data,
      ) as Promise<SuccessResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION],
      });

      showToast({
        type: "success",
        message: res.message || "Tạo thông báo thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo thông báo",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onCreate, isLoading: isPending };
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onUpdate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NotificationUpdateDto }) =>
      rootApiService.post(
        API_ENDPOINTS.NOTIFICATION.UPDATE.replace(":id", id),
        data,
      ) as Promise<SuccessResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION],
      });

      showToast({
        type: "success",
        message: res.message || "Cập nhật thông báo thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdate, isLoading: isPending };
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onDelete, isPending } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.delete(
        API_ENDPOINTS.NOTIFICATION.DELETE.replace(":id", id),
      ) as Promise<SuccessResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD],
      });

      showToast({
        type: "success",
        message: res.message || "Xóa thông báo thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi xóa",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onDelete, isLoading: isPending };
};

export const useNotificationDetail = (id: string) => {
  const { data, isLoading, refetch } = useQuery<{ data: NotificationItem }>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.DETAIL, id],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.DETAIL.replace(":id", id)),
    enabled: !!id,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
  };
};

export const useNotificationSettings = () => {
  const { data, isLoading, refetch } = useQuery<{
    data: NotificationSettingDto;
  }>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.GET_SETTINGS],
    queryFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.GET_SETTINGS),
  });

  return {
    settings: data?.data,
    isLoading,
    refetch,
  };
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onUpdateSettings, isPending } = useMutation({
    mutationFn: (data: UpdateNotificationSettingDto) =>
      rootApiService.post(
        API_ENDPOINTS.NOTIFICATION.UPDATE_SETTINGS,
        data,
      ) as Promise<SuccessResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATION.GET_SETTINGS],
      });

      showToast({
        type: "success",
        message: res.message || "Cập nhật cài đặt thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật cài đặt",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateSettings, isLoading: isPending };
};
