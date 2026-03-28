import type { ActionConfirmRef } from "@/components/ui/ActionConfirm";
import ActionConfirm from "@/components/ui/ActionConfirm";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import RowActions from "@/components/ui/RowAction";
import TableCustom, {
  type RowAction,
  type TableColumn,
} from "@/components/ui/TableCustom";
import { useToast } from "@/context/ToastContext";
import type { PaginationDto } from "@/dto";
import type {
  TranslationDto,
  TranslationFilterDto,
} from "@/dto/translation.dto";
import {
  useCreateTranslation,
  useDeleteTranslation,
  usePaginationTranslation,
  useUpdateTranslation,
} from "@/hooks/translation";
import { InputText } from "primereact/inputtext";
import { useCallback, useMemo, useRef, useState } from "react";

interface EditableRow extends TranslationDto {
  isEditing?: boolean;
  isNew?: boolean;
}

const initFilter: TranslationFilterDto = {
  key: "",
  vi: "",
  en: "",
};

export default function SettingLanguagePage() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<TranslationFilterDto>(initFilter);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<EditableRow | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<TranslationDto>>(
    {}
  );

  const [pagination, setPagination] = useState<
    PaginationDto<TranslationFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } =
    usePaginationTranslation(pagination);
  const { onCreateTranslation, isLoading: isCreating } = useCreateTranslation();
  const { onUpdateTranslation, isLoading: isUpdating } = useUpdateTranslation();
  const { onDeleteTranslation, isLoading: isDeleting } = useDeleteTranslation();

  const deleteConfirmRef = useRef<ActionConfirmRef>(null);
  const [selectedForDelete, setSelectedForDelete] =
    useState<TranslationDto | null>(null);

  const handleCreate = useCallback(() => {
    setEditingId(null);
    setEditingValues({});

    const tempId = `new_${Date.now()}`;
    setNewRow({
      id: tempId,
      key: "",
      en: "",
      vi: "",
      isEditing: true,
      isNew: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "",
      updatedBy: "",
      isDeleted: false,
    });
  }, []);

  const handleEdit = useCallback((record: TranslationDto) => {
    setNewRow(null);
    setEditingId(record.id);
    setEditingValues({
      key: record.key,
      en: record.en,
      vi: record.vi,
    });
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setNewRow(null);
    setEditingValues({});
  }, []);

  const handleSave = useCallback(
    async (record: EditableRow) => {
      const key = record.isNew ? newRow?.key : editingValues.key ?? record.key;
      const en = record.isNew ? newRow?.en : editingValues.en ?? record.en;
      const vi = record.isNew ? newRow?.vi : editingValues.vi ?? record.vi;

      if (!key?.trim() || !en?.trim() || !vi?.trim()) {
        showToast({
          type: "warn",
          title: "Cảnh báo",
          message: "Vui lòng điền đầy đủ thông tin",
          timeout: 3000,
        });
        return;
      }

      if (record.isNew) {
        onCreateTranslation(
          {
            key: key.trim(),
            en: en.trim(),
            vi: vi.trim(),
          },
          {
            onSuccess: () => {
              showToast({
                type: "success",
                title: "Thành công",
                message: "Tạo mới bản dịch thành công",
                timeout: 3000,
              });
              handleCancel();
              refetch();
            },
            onError: (error: any) => {
              showToast({
                type: "error",
                title: "Lỗi",
                message: error?.message || "Tạo mới thất bại",
                timeout: 3000,
              });
            },
          }
        );
      } else {
        onUpdateTranslation(
          {
            id: record.id,
            key: key!,
            en: en!.trim(),
            vi: vi!.trim(),
          },
          {
            onSuccess: () => {
              showToast({
                type: "success",
                title: "Thành công",
                message: "Cập nhật bản dịch thành công",
                timeout: 3000,
              });
              handleCancel();
              refetch();
            },
            onError: (error: any) => {
              showToast({
                type: "error",
                title: "Lỗi",
                message: error?.message || "Cập nhật thất bại",
                timeout: 3000,
              });
            },
          }
        );
      }
    },
    [
      newRow,
      editingValues,
      onCreateTranslation,
      onUpdateTranslation,
      handleCancel,
      refetch,
      showToast,
    ]
  );

  const handleDelete = useCallback(async () => {
    if (selectedForDelete) {
      await onDeleteTranslation(selectedForDelete.id);
      showToast({
        type: "success",
        title: "Thành công",
        message: "Xóa bản dịch thành công",
        timeout: 3000,
      });
      setSelectedForDelete(null);
      refetch();
    }
  }, [selectedForDelete, onDeleteTranslation, refetch, showToast]);

  const handleInputChange = useCallback(
    (field: keyof TranslationDto, value: string) => {
      if (newRow) {
        setNewRow((prev) => (prev ? { ...prev, [field]: value } : null));
      } else {
        setEditingValues((prev) => ({ ...prev, [field]: value }));
      }
    },
    [newRow]
  );

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: "key",
        label: "Tìm kiếm theo Key",
        type: "input",
        placeholder: "Nhập key để tìm kiếm...",
        col: 8,
      },
      {
        key: "vi",
        label: "Tìm kiếm theo Tiếng Việt",
        type: "input",
        placeholder: "Nhập bản dịch tiếng Việt để tìm kiếm...",
        col: 8,
      },
      {
        key: "en",
        label: "Tìm kiếm theo Tiếng Anh",
        type: "input",
        placeholder: "Nhập bản dịch tiếng Anh để tìm kiếm...",
        col: 8,
      },
    ],
    []
  );

  const displayData = useMemo((): EditableRow[] => {
    const rows = data.map((item) => ({
      ...item,
      isEditing: item.id === editingId,
      isNew: false,
    }));

    if (newRow) {
      return [newRow, ...rows];
    }

    return rows;
  }, [data, editingId, newRow]);

  const columns: TableColumn<EditableRow>[] = useMemo(
    () => [
      {
        field: "key",
        header: "Key",
        width: "30%",
        body: (row) => {
          if (row.isEditing && row.isNew) {
            return (
              <InputText
                value={newRow?.key || ""}
                onChange={(e) => handleInputChange("key", e.target.value)}
                placeholder="Nhập key"
                className="w-full"
              />
            );
          }
          if (row.isEditing) {
            return <span className="font-mono text-sm">{row.key}</span>;
          }
          return <span className="font-mono text-sm">{row.key}</span>;
        },
      },
      {
        field: "en",
        header: "Tiếng Anh",
        width: "30%",
        body: (row) => {
          if (row.isEditing) {
            const value = row.isNew ? newRow?.en : editingValues.en ?? row.en;
            return (
              <InputText
                value={value || ""}
                onChange={(e) => handleInputChange("en", e.target.value)}
                placeholder="Bản dịch tiếng Anh"
                className="w-full"
              />
            );
          }
          return row.en;
        },
      },
      {
        field: "vi",
        header: "Tiếng Việt",
        width: "30%",
        body: (row) => {
          if (row.isEditing) {
            const value = row.isNew ? newRow?.vi : editingValues.vi ?? row.vi;
            return (
              <InputText
                value={value || ""}
                onChange={(e) => handleInputChange("vi", e.target.value)}
                placeholder="Bản dịch tiếng Việt"
                className="w-full"
              />
            );
          }
          return row.vi;
        },
      },
    ],
    [newRow, editingValues, handleInputChange]
  );

  const rowActions: RowAction<EditableRow>[] = useMemo(
    () => [
      {
        key: "save",
        icon: "pi pi-check",
        tooltip: "Lưu",
        severity: "success",
        onClick: (record) => handleSave(record),
        visible: (record) => !!record.isEditing,
        loading: (record) => (record.isNew ? isCreating : isUpdating),
      },
      {
        key: "cancel",
        icon: "pi pi-times",
        tooltip: "Hủy",
        severity: "secondary",
        onClick: () => handleCancel(),
        visible: (record) => !!record.isEditing,
      },
      {
        key: "edit",
        icon: "pi pi-pencil",
        tooltip: "Chỉnh sửa",
        severity: "info",
        onClick: (record) => handleEdit(record),
        visible: (record) => !record.isEditing,
      },
      {
        key: "delete",
        icon: "pi pi-trash",
        tooltip: "Xóa",
        severity: "danger",
        onClick: (record) => {
          setSelectedForDelete(record);
          deleteConfirmRef.current?.show();
        },
        visible: (record) => !record.isEditing,
        disabled: isDeleting,
      },
    ],
    [handleSave, handleCancel, handleEdit, isCreating, isUpdating, isDeleting]
  );

  const handleSearch = useCallback(
    (isReset = false) => {
      setPagination((prev) => ({
        ...prev,
        skip: 0,
        where: isReset ? initFilter : { ...prev.where, ...filter },
      }));
      if (isReset) setFilter(initFilter);
    },
    [filter]
  );

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  }, []);

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
        data={displayData}
        columns={columns}
        loading={isLoading}
        rowActions={rowActions}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
        }}
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
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
      />
      <ActionConfirm
        ref={deleteConfirmRef}
        title="Xác nhận xóa bản dịch"
        confirmText="Xóa"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDelete}
      />
    </BaseView>
  );
}
