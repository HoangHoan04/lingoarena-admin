import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  BlogCommentDto,
  BlogCommentFilterDto,
  BlogDto,
  BlogFilterDto,
  CreateBlogDto,
  UpdateBlogDto,
} from "@/dto/blog.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationBlog = (params: PaginationDto<BlogFilterDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<BlogDto>>({
    queryKey: [API_ENDPOINTS.BLOG.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.BLOG.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useBlogDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<BlogDto>
  >({
    queryKey: [API_ENDPOINTS.BLOG.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.BLOG.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<BlogDto>;
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

export const useCreateBlog = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createBlog, isPending } = useMutation({
    mutationFn: (body: CreateBlogDto) =>
      rootApiService.post(
        API_ENDPOINTS.BLOG.CREATE,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo bài viết thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo bài viết",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
    });
  };

  return { onCreateBlog: createBlog, isLoading: isPending, refetch };
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateBlog, isPending } = useMutation({
    mutationFn: (data: UpdateBlogDto) => {
      return rootApiService.post(
        API_ENDPOINTS.BLOG.UPDATE,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật bài viết thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật bài viết",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateBlog: updateBlog, isLoading: isPending };
};

export const useActivateBlog = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateBlog, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.BLOG.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Kích hoạt bài viết thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi kích hoạt bài viết",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onActivateBlog,
    isLoading,
  };
};

export const useDeactivateBlog = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateBlog, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.BLOG.DEACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Ngừng hoạt động bài viết thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi ngừng hoạt động bài viết",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    isLoading,
    onDeactivateBlog,
  };
};

export const useBlogSelectBox = () => {
  const { data, isLoading, error } = useQuery<BlogDto[]>({
    queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.BLOG.SELECT_BOX) as Promise<BlogDto[]>,
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};

export const usePaginationBlogComment = (
  params: PaginationDto<BlogCommentFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<BlogCommentDto>
  >({
    queryKey: [API_ENDPOINTS.BLOG.PAGINATION_BLOG_COMMENT, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.BLOG.PAGINATION_BLOG_COMMENT, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useBlogCommentDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<BlogCommentDto>
  >({
    queryKey: [API_ENDPOINTS.BLOG.FIND_BLOG_COMMENT_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.BLOG.FIND_BLOG_COMMENT_BY_ID,
        {
          id,
        },
      );
      return res as SuccessResponse<BlogCommentDto>;
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

export const useDeleteBlogComment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteBlogComment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.BLOG.DELETE_BLOG_COMMENT, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BLOG.PAGINATION_BLOG_COMMENT],
        });
        showToast({
          type: "success",
          message: res.message || "Xóa bình luận thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi xóa bình luận",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onDeleteBlogComment,
    isLoading,
  };
};

export const useRestoreBlogComment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onRestoreBlogComment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.BLOG.RESTORE_BLOG_COMMENT, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BLOG.PAGINATION_BLOG_COMMENT],
        });
        showToast({
          type: "success",
          message: res.message || "Khôi phục bình luận thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi khôi phục bình luận",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onRestoreBlogComment,
    isLoading,
  };
};

export const usePublishBlog = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onPublishBlog, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.BLOG.PUBLISH_BLOG, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Xuất bản bài viết thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi xuất bản bài viết",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onPublishBlog,
    isLoading,
  };
};

export const useDraftBlog = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDraftBlog, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.BLOG.DRAFT_BLOG, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Chuyển bài viết sang bản nháp thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi chuyển sang bản nháp",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onDraftBlog,
    isLoading,
  };
};

export const useRejectBlog = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onRejectBlog, isPending: isLoading } = useMutation({
    mutationFn: (data: { id: string; reason?: string }) =>
      rootApiService.post(
        API_ENDPOINTS.BLOG.REJECT_BLOG,
        data,
      ) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Từ chối xuất bản bài viết thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi từ chối bài viết",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onRejectBlog,
    isLoading,
  };
};

export const useArchiveBlog = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onArchiveBlog, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.BLOG.ARCHIVE_BLOG, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Lưu trữ bài viết thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi lưu trữ bài viết",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onArchiveBlog,
    isLoading,
  };
};

export const useUnarchiveBlog = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onUnarchiveBlog, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.BLOG.UNARCHIVE_BLOG, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Khôi phục bài viết từ lưu trữ thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi khôi phục bài viết",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onUnarchiveBlog,
    isLoading,
  };
};

export const useChangeBlogStatus = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onChangeBlogStatus, isPending: isLoading } = useMutation(
    {
      mutationFn: (data: { id: string; status: string; reason?: string }) =>
        rootApiService.post(
          API_ENDPOINTS.BLOG.CHANGE_STATUS_BLOG,
          data,
        ) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BLOG.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BLOG.SELECT_BOX],
        });
        showToast({
          type: "success",
          message: res.message || "Thay đổi trạng thái bài viết thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi thay đổi trạng thái",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    },
  );

  return {
    onChangeBlogStatus,
    isLoading,
  };
};

export const useApproveBlogComment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onApproveBlogComment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.BLOG.APPROVE_BLOG_COMMENT, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BLOG.PAGINATION_BLOG_COMMENT],
        });
        showToast({
          type: "success",
          message: res.message || "Duyệt bình luận thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi duyệt bình luận",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onApproveBlogComment,
    isLoading,
  };
};

export const useRejectBlogComment = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onRejectBlogComment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.BLOG.REJECT_BLOG_COMMENT, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BLOG.PAGINATION_BLOG_COMMENT],
        });
        showToast({
          type: "success",
          message: res.message || "Từ chối bình luận thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi từ chối bình luận",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return {
    onRejectBlogComment,
    isLoading,
  };
};
