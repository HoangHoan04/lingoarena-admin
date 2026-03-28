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
import type { CustomerDto, CustomerFilterDto } from "@/dto/customer.dto";
import {
  useActivateCustomer,
  useDeactivateCustomer,
  usePaginationCustomer,
} from "@/hooks/customer";

import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: CustomerFilterDto = {
  code: "",
  name: "",
  phone: "",
  isDeleted: undefined,
};

export default function CustomerManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<CustomerFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<CustomerFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<CustomerDto[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(
    null,
  );
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationCustomer(pagination);
  const { onDeactivateCustomer, isLoading: isLoadingDeactivate } =
    useDeactivateCustomer();
  const { onActivateCustomer, isLoading: isLoadingActivate } =
    useActivateCustomer();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as CustomerFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedCustomer) return;
    await onActivateCustomer(selectedCustomer.id);
    await refetch();
    setSelectedCustomer(null);
  };

  const handleDeactivate = async () => {
    if (!selectedCustomer) return;
    await onDeactivateCustomer(selectedCustomer.id);
    await refetch();
    setSelectedCustomer(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.ADD_CUSTOMER
        .path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã khách hàng",
      type: "input",
      placeholder: "Nhập mã khách hàng",
      col: 6,
    },
    {
      key: "name",
      label: "Tên khách hàng",
      type: "input",
      placeholder: "Nhập tên khách hàng",
      col: 6,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
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

  const columns: TableColumn<CustomerDto>[] = [
    {
      field: "code",
      header: "Mã khách hàng",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên khách hàng",
      width: 200,
      sortable: true,
    },
    {
      field: "phone",
      header: "Số điện thoại",
      width: 200,
      sortable: true,
    },
    {
      field: "gender",
      header: "Giới tính",
      width: 220,
      sortable: true,
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 220,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: CustomerDto) => (
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

  const rowActions: RowAction<CustomerDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.DETAIL_CUSTOMER.path.replace(
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
          ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.EDIT_CUSTOMER.path.replace(
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
        setSelectedCustomer(record);
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
        setSelectedCustomer(record);
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

      <TableCustom<CustomerDto>
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
        emptyText="Không tìm thấy khách hàng nào"
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
        title="Xác nhận kích hoạt khách hàng"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động khách hàng"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
