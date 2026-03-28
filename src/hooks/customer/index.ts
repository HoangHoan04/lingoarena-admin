import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  CreateCustomerDto,
  CustomerDto,
  CustomerFilterDto,
  UpdateCustomerDto,
} from "@/dto/customer.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationCustomer = (
  params: PaginationDto<CustomerFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<CustomerDto>
  >({
    queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.CUSTOMER.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCustomerDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<CustomerDto>
  >({
    queryKey: [API_ENDPOINTS.CUSTOMER.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.CUSTOMER.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<CustomerDto>;
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

export const useCreateCustomer = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createCustomer, isPending } = useMutation({
    mutationFn: (body: CreateCustomerDto) =>
      rootApiService.post(
        API_ENDPOINTS.CUSTOMER.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER.SELECT_BOX],
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
      queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
    });
  };

  return { onCreateCustomer: createCustomer, isLoading: isPending, refetch };
};
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateCustomer, isPending } = useMutation({
    mutationFn: (data: UpdateCustomerDto) => {
      return rootApiService.post(
        API_ENDPOINTS.CUSTOMER.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER.SELECT_BOX],
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

  return { onUpdateCustomer: updateCustomer, isLoading: isPending };
};
export const useActivateCustomer = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateCustomer, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.CUSTOMER.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER.SELECT_BOX],
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
    },
  );

  return {
    onActivateCustomer,
    isLoading,
  };
};
export const useDeactivateCustomer = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateCustomer, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.CUSTOMER.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER.SELECT_BOX],
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
    onDeactivateCustomer,
  };
};
export const useCustomerSelectBox = () => {
  const { data, isLoading, error } = useQuery<CustomerDto[]>({
    queryKey: [API_ENDPOINTS.CUSTOMER.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.CUSTOMER.SELECT_BOX) as Promise<
        CustomerDto[]
      >,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
