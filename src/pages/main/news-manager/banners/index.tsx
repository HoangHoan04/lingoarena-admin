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
import type { BannerDto, BannerFilterDto } from "@/dto/banner.dto";
import {
  useActivateBanner,
  useDeactivateBanner,
  usePaginationBanner,
} from "@/hooks/banner";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: BannerFilterDto = {
  title: "",
  status: "",
  type: "",
};

export default function BannerManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<BannerFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<BannerFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<BannerDto[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<BannerDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationBanner(pagination);
  const { onDeactivateBanner, isLoading: isLoadingDeactivate } =
    useDeactivateBanner();
  const { onActivateBanner, isLoading: isLoadingActivate } =
    useActivateBanner();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as BannerFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedBanner) return;
    await onActivateBanner(selectedBanner.id);
    await refetch();
    setSelectedBanner(null);
  };

  const handleDeactivate = async () => {
    if (!selectedBanner) return;
    await onDeactivateBanner(selectedBanner.id);
    await refetch();
    setSelectedBanner(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children.ADD_BANNER.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "title",
      label: "Tiêu đề banner",
      type: "input",
      placeholder: "Nhập tiêu đề banner",
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
      key: "type",
      label: "Loại banner",
      type: "select",
      placeholder: "Nhập loại banner",
      options: Object.values(enumData.BANNER_TYPE || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
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

  const columns: TableColumn<BannerDto>[] = [
    {
      field: "url",
      header: "Đường dẫn banner",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "title",
      header: "Tiêu đề banner",
      width: 200,
      sortable: true,
    },
    {
      field: "type",
      header: "Loại banner",
      width: 220,
      sortable: true,
      body: (rowData: BannerDto) =>
        enumData.BANNER_TYPE[rowData.type as keyof typeof enumData.BANNER_TYPE]
          ?.name || "",
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: BannerDto) => (
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

  const rowActions: RowAction<BannerDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children.DETAIL_BANNER.path.replace(
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
          ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children.EDIT_BANNER.path.replace(
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
        setSelectedBanner(record);
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
        setSelectedBanner(record);
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

      <TableCustom<BannerDto>
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
        emptyText="Không tìm thấy banner nào"
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
        title="Xác nhận kích hoạt banner"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động banner"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
