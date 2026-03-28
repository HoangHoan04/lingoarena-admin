import { enumData } from "@/common/enums/enum";
import ActionConfirm, {
  type ActionConfirmRef,
} from "@/components/ui/ActionConfirm";
import AssignPermission from "@/components/ui/assign-permission";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import RowActions from "@/components/ui/RowAction";
import StatusTag from "@/components/ui/StatusTag";
import TableCustom, {
  type RowAction,
  type TableColumn,
} from "@/components/ui/TableCustom";
import type { PaginationDto } from "@/dto";
import type {
  CreateRoleDto,
  RoleDto,
  RoleFilterDto,
  UpdateRoleDto,
} from "@/dto/role.dto";

import {
  useCreateRole,
  useDeleteRole,
  usePaginationRole,
  useUpdateRole,
} from "@/hooks/role";
import { PrimeIcons } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { useRef, useState } from "react";

const initFilter: RoleFilterDto = {
  code: "",
  name: "",
  isDeleted: false,
};

export default function RoleManagerPage() {
  const [filter, setFilter] = useState<RoleFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<RoleFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<RoleDto | null>(null);

  const { data, isLoading, refetch, total } = usePaginationRole(pagination);
  const { onCreateRole, isPending: creating } = useCreateRole();
  const { onUpdateRole, isPending: updating } = useUpdateRole();
  const { onDeleteRole, isPending: deleting } = useDeleteRole();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedRoleForAssign, setSelectedRoleForAssign] =
    useState<RoleDto | null>(null);

  const deleteConfirmRef = useRef<ActionConfirmRef>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<RoleDto | null>(
    null
  );

  const handleSearch = (isReset = false) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleSubmit = async (values: any) => {
    if (editingItem) {
      const payload: UpdateRoleDto = { ...values, id: editingItem.id };
      onUpdateRole(payload, { onSuccess: () => setShowDialog(false) });
    } else {
      const payload: CreateRoleDto = values;
      onCreateRole(payload, { onSuccess: () => setShowDialog(false) });
    }
  };

  const handleDelete = async () => {
    if (selectedForDelete) {
      await onDeleteRole(selectedForDelete.id);
      setSelectedForDelete(null);
    }
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã vai trò",
      type: "input",
      col: 6,
    },
    {
      key: "name",
      label: "Tên vai trò",
      type: "input",
      col: 6,
    },
  ];

  const formFields: FormField[] = [
    {
      name: "code",
      label: "Mã vai trò",
      type: "input",
      required: true,
      placeholder: "ADMIN",
    },
    {
      name: "name",
      label: "Tên vai trò",
      type: "input",
      required: true,
      placeholder: "Quản trị viên",
    },
    {
      name: "description",
      label: "Mô tả",
      type: "textarea",
      required: false,
      placeholder: "Mô tả vai trò",
      gridColumn: "span 2",
    },
    {
      name: "isSystem",
      label: "Là hệ thống",
      type: "checkbox",
    },
  ];

  const columns: TableColumn<RoleDto>[] = [
    {
      field: "code",
      header: "Mã",
      width: 150,
      sortable: true,
    },
    {
      field: "name",
      header: "Tên vai trò",
      width: 250,
      sortable: true,
    },
    { field: "description", header: "Mô tả", width: 300 },
    {
      field: "isSystem",
      header: "Hệ thống",
      width: 120,
      align: "center",
      body: (row) =>
        row.isSystem ? (
          <StatusTag severity="warning" value={enumData.TRUE_FALSE.TRUE.name} />
        ) : (
          <StatusTag severity="info" value={enumData.TRUE_FALSE.FALSE.name} />
        ),
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 120,
      align: "center",
      body: (rowData) => (
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

  const handleCreate = () => {
    setEditingItem(null);
    setShowDialog(true);
  };

  const rowActions: RowAction<RoleDto>[] = [
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Sửa thông tin",
      severity: "secondary",
      onClick: (row) => {
        setEditingItem(row);
        setShowDialog(true);
      },
    },
    {
      key: "assign",
      icon: PrimeIcons.SHIELD,
      tooltip: "Phân quyền",
      severity: "info",
      onClick: (row) => {
        setSelectedRoleForAssign(row);
        setShowAssignDialog(true);
      },
    },
    {
      key: "delete",
      icon: PrimeIcons.TRASH,
      tooltip: "Xóa",
      severity: "danger",
      visible: (record) => !record.isDeleted,
      onClick: (row) => {
        setSelectedForDelete(row);
        deleteConfirmRef.current?.show();
      },
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={() => handleSearch()}
        onClear={() => handleSearch(true)}
      />

      <TableCustom
        data={data || []}
        columns={columns}
        loading={isLoading || deleting}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
        }}
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <RowActions
              actions={[CommonActions.create(handleCreate)]}
              justify="start"
              gap="medium"
            />
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
        rowActions={rowActions}
      />

      <Dialog
        header={editingItem ? "Cập nhật vai trò" : "Thêm vai trò mới"}
        visible={showDialog}
        style={{ width: "40vw" }}
        onHide={() => setShowDialog(false)}
      >
        <FormCustom
          fields={formFields}
          initialValues={editingItem || {}}
          loading={creating || updating}
          onSubmit={handleSubmit}
          onCancel={() => setShowDialog(false)}
          gridColumns={2}
        />
      </Dialog>

      <Dialog
        header={`Phân quyền cho vai trò: ${selectedRoleForAssign?.name || ""}`}
        visible={showAssignDialog}
        style={{ width: "60vw", height: "80vh" }}
        onHide={() => setShowAssignDialog(false)}
        maximizable
      >
        {showAssignDialog && selectedRoleForAssign && (
          <AssignPermission
            roleId={selectedRoleForAssign.id}
            onCancel={() => setShowAssignDialog(false)}
            onSuccess={() => {
              refetch();
            }}
          />
        )}
      </Dialog>
      <ActionConfirm
        ref={deleteConfirmRef}
        title="Xóa vai trò"
        onConfirm={handleDelete}
      />
    </BaseView>
  );
}
