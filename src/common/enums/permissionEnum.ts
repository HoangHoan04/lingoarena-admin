export const PERMISSION_ACTIONS = {
  CREATED: { code: "CREATED", name: "Tạo mới" },
  EDITED: { code: "EDITED", name: "Chỉnh sửa" },
  VIEW_LIST: { code: "VIEW_LIST", name: "Xem danh sách" },
  VIEW_DETAIL: { code: "VIEW_DETAIL", name: "Xem chi tiết" },
  DELETED: { code: "DELETED", name: "Xoá bỏ" },
  DEACTIVATED: { code: "DEACTIVATED", name: "Ngưng hoạt động" },
  ACTIVATED: { code: "ACTIVATED", name: "Kích hoạt" },
  EXPORTED: { code: "EXPORTED", name: "Xuất dữ liệu" },
  IMPORTED: { code: "IMPORTED", name: "Nhập dữ liệu" },
  SENT_APPROVED: { code: "SENT_APPROVED", name: "Gửi duyệt" },
  APPROVED: { code: "APPROVED", name: "Duyệt" },
  REJECTED: { code: "REJECTED", name: "Từ chối" },
  CANCELED: { code: "CANCELED", name: "Huỷ" },
  ASSIGN: { code: "ASSIGN", name: "Phân quyền" },
};

export const PERMISSION_ACTION_OPTIONS = Object.values(PERMISSION_ACTIONS).map(
  (action) => ({
    code: action.code,
    name: action.name,
  })
);

export const createPermissionCode = (
  module: string,
  action: string
): string => {
  return `${module.toUpperCase()}:${action.toUpperCase()}`;
};

export const parsePermissionCode = (
  code: string
): { module: string; action: string } | null => {
  const parts = code.split(":");
  if (parts.length !== 2) return null;
  return {
    module: parts[0],
    action: parts[1],
  };
};
