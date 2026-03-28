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
import type {
  DestinationDto,
  DestinationFilterDto,
} from "@/dto/destination.dto";
import {
  useActivateDestination,
  useDeactivateDestination,
  usePaginationDestination,
} from "@/hooks/destination";

import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: DestinationFilterDto = {
  name: "",
  country: "",
  region: "",
  status: "",
  isDeleted: undefined,
};

export default function DestinationManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<DestinationFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<DestinationFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<DestinationDto[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationDestination(pagination);
  const { onDeactivateDestination, isLoading: isLoadingDeactivate } =
    useDeactivateDestination();
  const { onActivateDestination, isLoading: isLoadingActivate } =
    useActivateDestination();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as DestinationFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedDestination) return;
    await onActivateDestination(selectedDestination.id);
    await refetch();
    setSelectedDestination(null);
  };

  const handleDeactivate = async () => {
    if (!selectedDestination) return;
    await onDeactivateDestination(selectedDestination.id);
    await refetch();
    setSelectedDestination(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.TOUR_MANAGER.children.DESTINATION_MANAGER.children
        .ADD_DESTINATION.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Tên điểm đến",
      type: "input",
      placeholder: "Nhập tên điểm đến",
      col: 6,
    },
    {
      key: "country",
      label: "Quốc gia",
      type: "input",
      placeholder: "Nhập quốc gia",
      col: 6,
    },
    {
      key: "region",
      label: "Khu vực",
      type: "input",
      placeholder: "Nhập khu vực",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "input",
      placeholder: "Nhập trạng thái",
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      options: Object.values(enumData.STATUS_FILTER || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
  ];

  const columns: TableColumn<DestinationDto>[] = [
    {
      field: "code",
      header: "Mã điểm đến",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên điểm đến",
      width: 200,
      sortable: true,
    },
    {
      field: "slug",
      header: "Đường dẫn",
      width: 200,
      sortable: true,
    },
    {
      field: "country",
      header: "Quốc gia",
      width: 220,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: DestinationDto) => (
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

  const rowActions: RowAction<DestinationDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.TOUR_MANAGER.children.DESTINATION_MANAGER.children.DETAIL_DESTINATION.path.replace(
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
          ROUTES.MAIN.TOUR_MANAGER.children.DESTINATION_MANAGER.children.EDIT_DESTINATION.path.replace(
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
        setSelectedDestination(record);
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
        setSelectedDestination(record);
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

      <TableCustom<DestinationDto>
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
        emptyText="Không tìm thấy điểm đến nào"
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
        title="Xác nhận kích hoạt điểm đến"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động điểm đến"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
