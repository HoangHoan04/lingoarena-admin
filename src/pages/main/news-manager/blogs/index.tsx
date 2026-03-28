import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums/enum";
import ActionConfirm, {
  type ActionConfirmRef,
} from "@/components/ui/ActionConfirm";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import RowActions from "@/components/ui/RowAction";
import StatusTag from "@/components/ui/StatusTag";
import TableCustom, {
  type RowAction,
  type TableColumn,
} from "@/components/ui/TableCustom";
import type { PaginationDto } from "@/dto";
import type { BlogDto, BlogFilterDto } from "@/dto/blog.dto";
import {
  useActivateBlog,
  useArchiveBlog,
  useDeactivateBlog,
  useDraftBlog,
  usePaginationBlog,
  usePublishBlog,
  useRejectBlog,
  useUnarchiveBlog,
} from "@/hooks/blog";
import { useRouter } from "@/routers/hooks";
import { useRef, useState } from "react";

export const initFilter: BlogFilterDto = {
  title: "",
  category: "",
  status: "",
};

export default function BlogManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<BlogFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<BlogFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<BlogDto[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogDto | null>(null);

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);
  const publishConfirmRef = useRef<ActionConfirmRef>(null);
  const draftConfirmRef = useRef<ActionConfirmRef>(null);
  const rejectConfirmRef = useRef<ActionConfirmRef>(null);
  const archiveConfirmRef = useRef<ActionConfirmRef>(null);
  const unarchiveConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationBlog(pagination);
  const { onDeactivateBlog, isLoading: isLoadingDeactivate } =
    useDeactivateBlog();
  const { onActivateBlog, isLoading: isLoadingActivate } = useActivateBlog();
  const { onPublishBlog, isLoading: isLoadingPublish } = usePublishBlog();
  const { onDraftBlog, isLoading: isLoadingDraft } = useDraftBlog();
  const { onRejectBlog, isLoading: isLoadingReject } = useRejectBlog();
  const { onArchiveBlog, isLoading: isLoadingArchive } = useArchiveBlog();
  const { onUnarchiveBlog, isLoading: isLoadingUnarchive } = useUnarchiveBlog();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as BlogFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedBlog) return;
    await onActivateBlog(selectedBlog.id);
    await refetch();
    setSelectedBlog(null);
  };

  const handleDeactivate = async () => {
    if (!selectedBlog) return;
    await onDeactivateBlog(selectedBlog.id);
    await refetch();
    setSelectedBlog(null);
  };

  const handlePublish = async () => {
    if (!selectedBlog) return;
    await onPublishBlog(selectedBlog.id);
    await refetch();
    setSelectedBlog(null);
  };

  const handleDraft = async () => {
    if (!selectedBlog) return;
    await onDraftBlog(selectedBlog.id);
    await refetch();
    setSelectedBlog(null);
  };

  const handleReject = async (reason?: string) => {
    if (!selectedBlog) return;
    await onRejectBlog({ id: selectedBlog.id, reason });
    await refetch();
    setSelectedBlog(null);
  };
  const handleUnarchive = async () => {
    if (!selectedBlog) return;
    await onUnarchiveBlog(selectedBlog.id);
    await refetch();
    setSelectedBlog(null);
  };

  const handleArchive = async () => {
    if (!selectedBlog) return;
    await onArchiveBlog(selectedBlog.id);
    await refetch();
    setSelectedBlog(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.ADD_BLOG.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "title",
      label: "Tiêu đề bài viết",
      type: "input",
      placeholder: "Nhập tiêu đề bài viết",
      col: 6,
    },
    {
      key: "category",
      label: "Danh mục bài viết",
      type: "input",
      placeholder: "Nhập danh mục bài viết",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái xuất bản",
      type: "select",
      placeholder: "Chọn trạng thái xuất bản",
      options: Object.values(enumData.BLOG_STATUS || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái hoạt động",
      type: "select",
      options: Object.values(enumData.STATUS_FILTER || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
  ];

  const getStatusSeverity = (
    status: string,
  ): "success" | "info" | "warning" | "danger" | "secondary" => {
    const blogStatus =
      enumData.BLOG_STATUS[status as keyof typeof enumData.BLOG_STATUS];
    if (!blogStatus) return "info";

    switch (blogStatus.color) {
      case "green":
        return "success";
      case "blue":
        return "info";
      case "orange":
        return "warning";
      case "red":
        return "danger";
      case "gray":
        return "secondary";
      default:
        return "info";
    }
  };

  const columns: TableColumn<BlogDto>[] = [
    {
      field: "title",
      header: "Tiêu đề bài viết",
      width: 250,
      sortable: true,
      frozen: true,
    },
    {
      field: "category",
      header: "Danh mục",
      width: 150,
      sortable: true,
    },
    {
      field: "viewCount",
      header: "Lượt xem",
      width: 100,
      align: "center",
      sortable: true,
    },
    {
      field: "likeCount",
      header: "Lượt thích",
      width: 100,
      align: "center",
      sortable: true,
    },
    {
      field: "publishedAt",
      header: "Ngày xuất bản",
      width: 150,
      sortable: true,
      body: (rowData: BlogDto) =>
        rowData.publishedAt
          ? new Date(rowData.publishedAt).toLocaleDateString("vi-VN")
          : "",
    },
    {
      field: "status",
      header: "Trạng thái xuất bản",
      width: 180,
      sortable: true,
      body: (rowData: BlogDto) => {
        const statusData =
          enumData.BLOG_STATUS[
            rowData.status as keyof typeof enumData.BLOG_STATUS
          ];
        return (
          <StatusTag
            severity={getStatusSeverity(rowData.status)}
            value={statusData?.name || rowData.status}
          />
        );
      },
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: BlogDto) => (
        <StatusTag
          severity={rowData.isDeleted ? "danger" : "success"}
          value={
            rowData.isDeleted
              ? enumData.STATUS_FILTER.INACTIVE.name
              : enumData.STATUS_FILTER.ACTIVE.name
          }
        />
      ),
    },
  ];

  const rowActions: RowAction<BlogDto>[] = [
    {
      key: "view",
      icon: <i className="pi pi-eye"></i>,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.DETAIL_BLOG.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: <i className="pi pi-pencil"></i>,
      tooltip: "Chỉnh sửa",
      severity: "success",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.EDIT_BLOG.path.replace(
            ":id",
            record.id,
          ),
        );
      },
    },
    {
      key: "deactivate",
      icon: <i className="pi pi-pause-circle"></i>,
      tooltip: "Ngưng hoạt động",
      severity: "warning",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        setSelectedBlog(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: <i className="pi pi-play-circle"></i>,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => record.isDeleted,
      onClick: (record) => {
        setSelectedBlog(record);
        activateConfirmRef.current?.show();
      },
    },
    {
      key: "publish",
      label: "Xuất bản",
      icon: <i className="pi pi-print"></i>,
      severity: "success",
      visible: (record) => record.status !== "PUBLISHED" && !record.isDeleted,
      onClick: (record) => {
        setSelectedBlog(record);
        publishConfirmRef.current?.show();
      },
    },
    {
      key: "draft",
      label: "Chuyển sang nháp",
      icon: <i className="pi pi-clipboard"></i>,
      severity: "info",
      visible: (record) => record.status === "PUBLISHED" && !record.isDeleted,
      onClick: () => draftConfirmRef.current?.show(),
    },
    {
      key: "reject",
      label: "Từ chối",
      icon: <i className="pi pi-times"></i>,
      severity: "danger",
      visible: (record) =>
        (record.status === "PENDING_REVIEW" ||
          record.status === "UNDER_REVIEW") &&
        !record.isDeleted,
      onClick: () => rejectConfirmRef.current?.show(),
    },
    {
      key: "archive",
      label: "Lưu trữ",
      icon: <i className="pi pi-save"></i>,
      severity: "warning",
      visible: (record) => !record.isDeleted,
      onClick: () => archiveConfirmRef.current?.show(),
    },
    {
      key: "unarchive",
      label: "Khôi phục",
      icon: <i className="pi pi-replay"></i>,
      severity: "info",
      visible: (record) => record.isDeleted,
      onClick: () => unarchiveConfirmRef.current?.show(),
    },
  ];

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<BlogDto>
        data={data || []}
        columns={columns}
        loading={
          isLoading ||
          isLoadingActivate ||
          isLoadingDeactivate ||
          isLoadingPublish ||
          isLoadingDraft ||
          isLoadingReject ||
          isLoadingArchive ||
          isLoadingUnarchive
        }
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy bài viết nào"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
          showTotal: true,
        }}
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <RowActions
              actions={[
                {
                  ...CommonActions.create(handleCreate),
                },
              ]}
              justify="start"
              gap="medium"
            />
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt bài viết"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
        message="Bạn có chắc chắn muốn kích hoạt bài viết này không?"
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động bài viết"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
        message="Bạn có chắc chắn muốn ngừng hoạt động bài viết này không?"
      />

      <ActionConfirm
        ref={publishConfirmRef}
        title="Xác nhận xuất bản bài viết"
        message="Bạn có chắc chắn muốn xuất bản bài viết này không?"
        confirmText="Xuất bản"
        cancelText="Hủy"
        onConfirm={handlePublish}
      />

      <ActionConfirm
        ref={draftConfirmRef}
        title="Xác nhận chuyển sang bản nháp"
        message="Bạn có chắc chắn muốn chuyển bài viết này sang bản nháp không?"
        confirmText="Chuyển sang nháp"
        cancelText="Hủy"
        onConfirm={handleDraft}
      />

      <ActionConfirm
        ref={rejectConfirmRef}
        title="Xác nhận từ chối bài viết"
        message="Bạn có chắc chắn muốn từ chối bài viết này không?"
        confirmText="Từ chối"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleReject}
      />

      <ActionConfirm
        ref={archiveConfirmRef}
        title="Xác nhận lưu trữ bài viết"
        message="Bạn có chắc chắn muốn lưu trữ bài viết này không?"
        confirmText="Lưu trữ"
        cancelText="Hủy"
        onConfirm={handleArchive}
      />

      <ActionConfirm
        ref={unarchiveConfirmRef}
        title="Xác nhận khôi phục từ lưu trữ"
        message="Bạn có chắc chắn muốn khôi phục bài viết này từ lưu trữ không?"
        confirmText="Khôi phục"
        cancelText="Hủy"
        onConfirm={handleUnarchive}
      />
    </BaseView>
  );
}
