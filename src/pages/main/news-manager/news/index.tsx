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
import type { NewDto, NewFilterDto } from "@/dto/new.dto";
import {
  useActivateNew,
  useDeactivateNew,
  usePaginationNew,
} from "@/hooks/new";

import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: NewFilterDto = {
  titleVI: "",
  titleEN: "",
  status: "",
  type: "",
};

export default function NewManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<NewFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<NewFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<NewDto[]>([]);
  const [selectedNew, setSelectedNew] = useState<NewDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationNew(pagination);
  const { onDeactivateNew, isLoading: isLoadingDeactivate } =
    useDeactivateNew();
  const { onActivateNew, isLoading: isLoadingActivate } = useActivateNew();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as NewFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedNew) return;
    await onActivateNew(selectedNew.id);
    await refetch();
    setSelectedNew(null);
  };

  const handleDeactivate = async () => {
    if (!selectedNew) return;
    await onDeactivateNew(selectedNew.id);
    await refetch();
    setSelectedNew(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.ADD_NEW.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "title",
      label: "Tiêu đề tin tức",
      type: "input",
      placeholder: "Nhập tiêu đề tin tức",
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
      label: "Loại tin tức",
      type: "select",
      placeholder: "Nhập loại tin tức",
      options: Object.values(enumData.NEW_TYPE || {}).map((item: any) => ({
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

  const columns: TableColumn<NewDto>[] = [
    {
      field: "title",
      header: "Tiêu đề tin tức",
      width: 200,
      sortable: true,
    },
    {
      field: "type",
      header: "Loại tin tức",
      width: 220,
      sortable: true,
      body: (rowData: NewDto) =>
        enumData.NEW_TYPE[rowData.type as keyof typeof enumData.NEW_TYPE]
          ?.name || "",
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: NewDto) => (
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

  const rowActions: RowAction<NewDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.DETAIL_NEW.path.replace(
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
          ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.EDIT_NEW.path.replace(
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
        setSelectedNew(record);
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
        setSelectedNew(record);
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

      <TableCustom<NewDto>
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
        emptyText="Không tìm thấy tin tức nào"
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
        title="Xác nhận kích hoạt tin tức"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động tin tức"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
