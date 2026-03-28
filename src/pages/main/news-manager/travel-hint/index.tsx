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
import type { TravelHintDto, TravelHintFilterDto } from "@/dto/travel-hint.dto";
import {
  useActivateTravelHint,
  useDeactivateTravelHint,
  usePaginationTravelHint,
} from "@/hooks/travel-hint";

import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: TravelHintFilterDto = {
  locationName: "",
  type: "",
  tags: [],
  isDeleted: undefined,
};

export default function TravelHintManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<TravelHintFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<TravelHintFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<TravelHintDto[]>([]);
  const [selectedTravelHint, setSelectedTravelHint] =
    useState<TravelHintDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationTravelHint(pagination);
  const { onDeactivateTravelHint, isLoading: isLoadingDeactivate } =
    useDeactivateTravelHint();
  const { onActivateTravelHint, isLoading: isLoadingActivate } =
    useActivateTravelHint();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as TravelHintFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedTravelHint) return;
    await onActivateTravelHint(selectedTravelHint.id);
    await refetch();
    setSelectedTravelHint(null);
  };

  const handleDeactivate = async () => {
    if (!selectedTravelHint) return;
    await onDeactivateTravelHint(selectedTravelHint.id);
    await refetch();
    setSelectedTravelHint(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.NEW_MANAGER.children.TRAVEL_HINT_MANAGER.children
        .ADD_TRAVEL_HINT.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "locationName",
      label: "Tên địa điểm",
      type: "input",
      placeholder: "Nhập tên địa điểm",
      col: 6,
    },
    {
      key: "tags",
      label: "Thẻ",
      type: "multiSelect",
      placeholder: "Nhập thẻ",
      col: 6,
    },
    {
      key: "type",
      label: "Loại banner",
      type: "select",
      placeholder: "Nhập loại banner",
      options: Object.values(enumData.TRAVEL_HINT_TYPE || {}).map(
        (item: any) => ({
          label: item.name,
          value: item.code,
        }),
      ),
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

  const columns: TableColumn<TravelHintDto>[] = [
    {
      field: "month",
      header: "Tháng đề xuất",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "locationName",
      header: "Tên địa điểm",
      width: 200,
      sortable: true,
    },
    {
      field: "type",
      header: "Loại địa điểm",
      width: 200,
      sortable: true,
    },
    {
      field: "tags",
      header: "Thẻ",
      width: 220,
      sortable: true,
      body: (rowData: TravelHintDto) =>
        enumData.TRAVEL_HINT_TYPE[
          rowData.type as keyof typeof enumData.TRAVEL_HINT_TYPE
        ]?.name || "",
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: TravelHintDto) => (
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

  const rowActions: RowAction<TravelHintDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.NEW_MANAGER.children.TRAVEL_HINT_MANAGER.children.DETAIL_TRAVEL_HINT.path.replace(
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
          ROUTES.MAIN.NEW_MANAGER.children.TRAVEL_HINT_MANAGER.children.EDIT_TRAVEL_HINT.path.replace(
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
        setSelectedTravelHint(record);
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
        setSelectedTravelHint(record);
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

      <TableCustom<TravelHintDto>
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
        emptyText="Không tìm thấy địa điểm gợi ý nào"
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
        title="Xác nhận kích hoạt địa điểm gợi ý"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động địa điểm gợi ý"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
