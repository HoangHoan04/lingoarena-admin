import { PrimeIcons } from "primereact/api";
import type { ActionButton } from "./RowAction";

export const CommonActions = {
  create: (onClick?: () => void): ActionButton => ({
    key: "create",
    label: "Thêm mới",
    icon: PrimeIcons.PLUS_CIRCLE,
    severity: "success",
    onClick,
  }),

  update: (onClick?: () => void): ActionButton => ({
    key: "update",
    label: "Cập nhật",
    icon: PrimeIcons.PENCIL,
    severity: "warning",
    onClick,
  }),

  delete: (onClick?: () => void): ActionButton => ({
    key: "delete",
    label: "Xóa",
    icon: PrimeIcons.TRASH,
    severity: "danger",
    onClick,
  }),

  refresh: (onClick?: () => void): ActionButton => ({
    key: "refresh",
    label: "Làm mới",
    icon: PrimeIcons.REFRESH,
    severity: "info",
    onClick,
  }),

  uploadExcel: (
    onDownloadTemplate?: () => void,
    onUploadFile?: (file: File) => void,
  ): ActionButton => ({
    key: "upload",
    label: "Nhập Excel",
    icon: PrimeIcons.FILE_EXCEL,
    severity: "success",
    subActions: [
      {
        key: "download-template",
        label: "Tải file mẫu",
        icon: PrimeIcons.DOWNLOAD,
        onClick: onDownloadTemplate,
      },
      {
        key: "upload-file",
        label: "Tải file lên",
        icon: PrimeIcons.UPLOAD,
        onClick: onUploadFile as any,
      },
    ],
  }),

  exportExcel: (onClick?: () => void): ActionButton => ({
    key: "export-excel",
    label: "Xuất Excel",
    icon: PrimeIcons.FILE_EXCEL,
    severity: "success",
    onClick,
  }),

  exportPdf: (onClick?: () => void): ActionButton => ({
    key: "export-pdf",
    label: "Xuất PDF",
    icon: PrimeIcons.FILE_PDF,
    severity: "danger",
    onClick,
  }),

  save: (onClick?: () => void, loading?: boolean): ActionButton => ({
    key: "save",
    label: "Lưu",
    icon: PrimeIcons.SAVE,
    severity: "info",
    loading,
    onClick,
  }),

  cancel: (onClick?: () => void): ActionButton => ({
    key: "cancel",
    label: "Hủy",
    icon: PrimeIcons.TIMES,
    severity: "secondary",
    onClick,
  }),

  view: (onClick?: () => void): ActionButton => ({
    key: "view",
    label: "Xem chi tiết",
    icon: PrimeIcons.EYE,
    severity: "info",
    onClick,
  }),

  copy: (onClick?: () => void): ActionButton => ({
    key: "copy",
    label: "Sao chép",
    icon: PrimeIcons.COPY,
    severity: "help",
    onClick,
  }),

  print: (onClick?: () => void): ActionButton => ({
    key: "print",
    label: "In",
    icon: PrimeIcons.PRINT,
    severity: "secondary",
    onClick,
  }),

  filter: (onClick?: () => void): ActionButton => ({
    key: "filter",
    label: "Bộ lọc",
    icon: PrimeIcons.FILTER,
    severity: "info",
    onClick,
  }),

  settings: (onClick?: () => void): ActionButton => ({
    key: "settings",
    label: "Cài đặt",
    icon: PrimeIcons.COG,
    severity: "secondary",
    onClick,
  }),

  approve: (onClick?: () => void): ActionButton => ({
    key: "approve",
    label: "Phê duyệt",
    icon: PrimeIcons.CHECK_CIRCLE,
    severity: "success",
    onClick,
  }),

  reject: (onClick?: () => void): ActionButton => ({
    key: "reject",
    label: "Từ chối",
    icon: PrimeIcons.TIMES_CIRCLE,
    severity: "danger",
    onClick,
  }),
};
