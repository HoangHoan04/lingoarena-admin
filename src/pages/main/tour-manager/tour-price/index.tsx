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
import type { TourPriceDto, TourPriceFilterDto } from "@/dto/tour-price.dto";
import {
  useActivateTourPrice,
  useDeactivateTourPrice,
  usePaginationTourPrice,
} from "@/hooks/tour-price";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: TourPriceFilterDto = {
  code: "",
  tourDetailId: "",
};

export default function TourPriceManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<TourPriceFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<TourPriceFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<TourPriceDto[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourPriceDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationTourPrice(pagination);
  const { onDeactivateTourPrice, isLoading: isLoadingDeactivate } =
    useDeactivateTourPrice();
  const { onActivateTourPrice, isLoading: isLoadingActivate } =
    useActivateTourPrice();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as TourPriceFilterDto);
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
    await onActivateTourPrice(selectedTour.id);
    await refetch();
    setSelectedTour(null);
  };

  const handleDeactivate = async () => {
    if (!selectedTour) return;
    await onDeactivateTourPrice(selectedTour.id);
    await refetch();
    setSelectedTour(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.TOUR_MANAGER.children.TOUR_PRICE_MANAGER.children
        .ADD_TOUR_PRICE.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã tour price",
      type: "input",
      placeholder: "Nhập mã tour price",
      col: 6,
    },
    {
      key: "tourDetailId",
      label: "Chi tiết tour được liên kết",
      type: "select",
      placeholder: "Chọn chi tiết tour",
      col: 6,
    },
  ];

  const columns: TableColumn<TourPriceDto>[] = [
    {
      field: "code",
      header: "Mã tour price",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "tourDetailId",
      header: "Chi tiết tour ID",
      width: 350,
      sortable: false,
    },
    {
      field: "priceType",
      header: "Loại giá",
      width: 100,
      sortable: true,
      align: "center",
    },
    {
      field: "price",
      header: "Giá",
      width: 100,
      sortable: true,
      align: "center",
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 130,
      align: "center",
      body: (rowData: TourPriceDto) => {
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
      body: (rowData: TourPriceDto) => (
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

  const rowActions: RowAction<TourPriceDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.TOUR_MANAGER.children.TOUR_PRICE_MANAGER.children.DETAIL_TOUR_PRICE.path.replace(
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
          ROUTES.MAIN.TOUR_MANAGER.children.TOUR_PRICE_MANAGER.children.EDIT_TOUR_PRICE.path.replace(
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

      <TableCustom<TourPriceDto>
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
