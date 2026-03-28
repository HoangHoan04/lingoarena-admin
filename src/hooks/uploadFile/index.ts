import { useToast } from "@/context/ToastContext";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation } from "@tanstack/react-query";

export const useUploadMutiple = () => {
  const { showToast } = useToast();
  const { isError, data, error, mutateAsync, mutate, isPending } = useMutation({
    mutationFn: (variables: FormData) =>
      rootApiService.post(API_ENDPOINTS.UPLOAD_FILE.MULTI, variables),
    onSuccess: (data: any) => {
      showToast({
        type: "success",
        title: "Upload thành công",
        message: data.message,
      });
    },
    onError: (e: any) => {
      showToast({
        type: "error",
        title: "Upload thất bại",
        message: e.message,
      });
    },
  });

  return {
    isError,
    data: data?.data,
    error,
    mutate,
    mutateAsync,
    isPending,
  };
};

export const useUploadSingle = () => {
  const { showToast } = useToast();
  const { isError, data, error, mutateAsync, mutate, isPending } = useMutation({
    mutationFn: (variables: FormData) =>
      rootApiService.post(API_ENDPOINTS.UPLOAD_FILE.SINGLE, variables),
    onSuccess: (data: any) => {
      showToast({
        type: "success",
        title: "Upload thành công",
        message: data.message || "Tải lên thành công",
      });
    },
    onError: (e: any) => {
      showToast({
        type: "error",
        title: "Upload thất bại",
        message:
          e?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại",
      });
    },
  });

  return {
    isError,
    data: data?.data,
    error,
    mutate,
    onUpload: mutateAsync,
    isLoading: isPending,
  };
};
