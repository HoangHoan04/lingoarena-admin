import { formatTimeAgo } from "@/common/helpers/format";
import BaseView from "@/components/ui/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import TableCustom, {
  type RowAction,
  type TableColumn,
} from "@/components/ui/TableCustom";
import type { PaginationDto } from "@/dto";
import type {
  NotificationFilterDto,
  NotificationItem,
} from "@/dto/notification.dto";
import {
  useMarkAllRead,
  useMarkReadList,
  usePaginationNotification,
} from "@/hooks/notification";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useState } from "react";

const initFilter: NotificationFilterDto = {
  priority: "normal",
  notificationType: "system",
  isRead: false,
  relatedEntity: "booking",
};

const NotificationListPage = () => {
  const [filter, setFilter] = useState<NotificationFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<NotificationFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const {
    data: notifications,
    total,
    isLoading,
    refetch,
  } = usePaginationNotification(pagination);

  const { onMarkReadList } = useMarkReadList();
  const { onMarkAllRead } = useMarkAllRead();

  const getIconByType = (type: string) => {
    const lowerType = type?.toLowerCase() || "info";
    if (lowerType.includes("warn") || lowerType.includes("cảnh báo"))
      return "pi pi-exclamation-triangle";
    if (lowerType.includes("error") || lowerType.includes("lỗi"))
      return "pi pi-times-circle";
    if (lowerType.includes("success") || lowerType.includes("thành công"))
      return "pi pi-check-circle";
    return "pi pi-info-circle";
  };

  const getSeverityByType = (type: string) => {
    const lowerType = type?.toLowerCase() || "info";
    if (lowerType.includes("warn") || lowerType.includes("cảnh báo"))
      return "warning";
    if (lowerType.includes("error") || lowerType.includes("lỗi"))
      return "danger";
    if (lowerType.includes("success") || lowerType.includes("thành công"))
      return "success";
    return "info";
  };

  const filterFields: FilterField[] = [
    {
      key: "type",
      label: "Loại thông báo",
      type: "select",
      placeholder: "Chọn loại thông báo",
      col: 8,
      options: [
        { label: "Thông báo", value: "info" },
        { label: "Cảnh báo", value: "warning" },
        { label: "Lỗi", value: "error" },
        { label: "Thành công", value: "success" },
      ],
    },
    {
      key: "priority",
      label: "Độ ưu tiên",
      type: "select",
      placeholder: "Chọn độ ưu tiên",
      col: 8,
      options: [
        { label: "Thấp", value: "low" },
        { label: "Trung bình", value: "normal" },
        { label: "Cao", value: "high" },
        { label: "Khẩn cấp", value: "urgent" },
      ],
    },
    {
      key: "isRead",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      col: 8,
      options: [
        { label: "Đã đọc", value: true },
        { label: "Chưa đọc", value: false },
      ],
    },
  ];

  const columns: TableColumn<NotificationItem>[] = [
    {
      field: "type",
      header: "Loại thông báo",
      body: (rowData) => (
        <Tag
          icon={getIconByType(rowData.type)}
          value={rowData.type}
          severity={getSeverityByType(rowData.type) as any}
        />
      ),
    },
    {
      field: "title",
      header: "Tiêu đề",
      body: (rowData) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-semibold ${
              !rowData.isRead ? "text-blue-700" : ""
            }`}
          >
            {rowData.title}
          </span>
          {!rowData.isRead && (
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
          )}
        </div>
      ),
    },
    {
      field: "content",
      header: "Nội dung",
      body: (rowData) => (
        <div className="whitespace-normal wrap-break-word">
          {rowData.content}
        </div>
      ),
    },
    {
      field: "priority",
      header: "Độ ưu tiên",
      width: "120px",
      align: "center",
      body: (rowData) => {
        const severity =
          rowData.priority === "urgent"
            ? "danger"
            : rowData.priority === "high"
              ? "warning"
              : rowData.priority === "low"
                ? "secondary"
                : "info";
        return <Tag value={rowData.priority} severity={severity as any} />;
      },
    },
    {
      field: "publishDate",
      header: "Thời gian tạo",
      body: (rowData) => (
        <span className="text-sm">{formatTimeAgo(rowData.publishDate)}</span>
      ),
    },
    {
      field: "isRead",
      header: "Trạng thái",
      width: "50px",
      type: "boolean",
      align: "center",
    },
  ];

  const handleMarkAsRead = (record: NotificationItem) => {
    if (!record.isRead) {
      onMarkReadList([record.id]);
    }
  };

  const rowActions: RowAction<NotificationItem>[] = [
    {
      key: "markRead",
      icon: "pi pi-check",
      tooltip: "notification.actions.markAsRead",
      severity: "success",
      onClick: handleMarkAsRead,
      disabled: (record) => record.isRead,
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as NotificationFilterDto);
  };

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom
        data={notifications}
        columns={columns}
        loading={isLoading}
        rowActions={rowActions}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
          showTotal: true,
        }}
        scrollable={true}
        stripedRows={true}
        showGridlines={true}
        emptyText="Không tìm thấy thông báo nào"
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <Button
              label="Đánh dấu tất cả đã đọc"
              icon="pi pi-check-square"
              severity="info"
              onClick={() => onMarkAllRead()}
            />
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />
    </BaseView>
  );
};

export default NotificationListPage;
