import { ROUTES } from "@/common/constants/routes";
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
import type { TourDto, TourFilterDto } from "@/dto/tour.dto";
import {
  useActivateTour,
  useDeactivateTour,
  usePaginationTour,
} from "@/hooks/tour";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: TourFilterDto = {
  title: "",
  code: "",
  location: "",
  category: "",
  tags: [],
  status: "",
  isDeleted: undefined,
};

export default function TourManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<TourFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<TourFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<TourDto[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationTour(pagination);
  const { onDeactivateTour, isLoading: isLoadingDeactivate } =
    useDeactivateTour();
  const { onActivateTour, isLoading: isLoadingActivate } = useActivateTour();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as TourFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedTour) return;
    await onActivateTour(selectedTour.id);
    await refetch();
    setSelectedTour(null);
  };

  const handleDeactivate = async () => {
    if (!selectedTour) return;
    await onDeactivateTour(selectedTour.id);
    await refetch();
    setSelectedTour(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.TOUR_MANAGER.children.TOUR_LIST.children.ADD_TOUR.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã tour",
      type: "input",
      placeholder: "Nhập mã tour",
      col: 6,
    },
    {
      key: "title",
      label: "Tên tour",
      type: "input",
      placeholder: "Nhập tên tour",
      col: 6,
    },
    {
      key: "location",
      label: "Địa điểm",
      type: "input",
      placeholder: "Nhập địa điểm",
      col: 6,
    },
    {
      key: "category",
      label: "Danh mục",
      type: "input",
      placeholder: "Nhập danh mục",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái tour",
      type: "select",
      options: Object.values(enumData.TOUR_STATUS || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      placeholder: "Chọn trạng thái",
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Hoạt động",
      type: "select",
      options: Object.values(enumData.STATUS_FILTER || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      placeholder: "Chọn trạng thái hoạt động",
      col: 6,
    },
  ];

  const columns: TableColumn<TourDto>[] = [
    {
      field: "code",
      header: "Mã tour",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "title",
      header: "Tên tour",
      width: 250,
      sortable: true,
    },
    {
      field: "location",
      header: "Địa điểm",
      width: 180,
      sortable: true,
    },
    {
      field: "durations",
      header: "Thời gian",
      width: 120,
      sortable: true,
      align: "center",
    },
    {
      field: "category",
      header: "Danh mục",
      width: 150,
      sortable: true,
    },
    {
      field: "rating",
      header: "Đánh giá",
      width: 100,
      sortable: true,
      align: "center",
      body: (rowData: TourDto) => (
        <div className="flex items-center gap-1">
          <i className="pi pi-star-fill text-yellow-500" />
          <span>{rowData.rating?.toFixed(1) || "0.0"}</span>
          <span className="text-gray-500 text-sm">
            ({rowData.reviewCount || 0})
          </span>
        </div>
      ),
    },
    {
      field: "viewCount",
      header: "Lượt xem",
      width: 100,
      sortable: true,
      align: "center",
    },
    {
      field: "bookingCount",
      header: "Lượt đặt",
      width: 100,
      sortable: true,
      align: "center",
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 130,
      align: "center",
      body: (rowData: TourDto) => {
        const status = Object.values(enumData.TOUR_STATUS || {}).find(
          (s: any) => s.code === rowData.status,
        ) as any;
        return (
          <StatusTag
            severity={
              status?.code === enumData.TOUR_STATUS.ACTIVE.code
                ? "success"
                : status?.code === enumData.TOUR_STATUS.INACTIVE.code
                  ? "warning"
                  : "danger"
            }
            value={status?.name || rowData.status}
          />
        );
      },
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 120,
      align: "center",
      body: (rowData: TourDto) => (
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

  const rowActions: RowAction<TourDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.TOUR_MANAGER.children.TOUR_LIST.children.DETAIL_TOUR.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "success",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.TOUR_MANAGER.children.TOUR_LIST.children.EDIT_TOUR.path.replace(
            ":id",
            record.id,
          ),
        );
      },
    },
    {
      key: "deactivate",
      icon: PrimeIcons.BAN,
      tooltip: "Ngưng hoạt động",
      severity: "warning",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        setSelectedTour(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => record.isDeleted,
      onClick: (record) => {
        setSelectedTour(record);
        activateConfirmRef.current?.show();
      },
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

      <TableCustom<TourDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingActivate || isLoadingDeactivate}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy tour nào"
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
        title="Xác nhận kích hoạt tour"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động tour"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
