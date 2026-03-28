export const enumData = {
  maxSizeUpload: 10,
  PAGE: {
    PAGEINDEX: 1,
    PAGESIZE: 10,
    PAGESIZE_MAX: 1000000,
    LST_PAGESIZE: [10, 20, 50, 100],
    TOTAL: 0,
  },

  TRUE_FALSE: {
    TRUE: { value: "true", code: "TRUE", name: "Có" },
    FALSE: { value: "false", code: "FALSE", name: "Không" },
  },

  STATUS_FILTER: {
    ALL: { value: undefined, code: "ALL", name: "Tất cả" },
    ACTIVE: { value: false, code: "ACTIVE", name: "Đang hoạt động" },
    INACTIVE: { value: true, code: "INACTIVE", name: "Ngưng hoạt động" },
  },

  DATA_TYPE: {
    STRING: { code: "STRING", name: "Kiểu chuỗi", format: "" },
    INT: { code: "INT", name: "Kiểu sổ nguyên", format: "" },
    FLOAT: { code: "FLOAT", name: "Kiểu sổ thập phân", format: "" },
    DATE: { code: "DATE", name: "Kiểu ngày", format: "dd/MM/yyyy" },
    DATETIME: {
      code: "DATETIME",
      name: "Kiểu ngày giờ",
      format: "dd/MM/yyyy HH:mm:ss",
    },
    TIME: { code: "TIME", name: "Kiểu giờ", format: "HH:mm:ss" },
    BOOLEAN: { code: "BOOLEAN", name: "Kiểu checkbox", format: "" },
  },

  DAY_IN_WEEK: {
    SUNDAY: { code: "SUNDAY", name: "Chủ nhật" },
    MONDAY: { code: "MONDAY", name: "Thứ hai" },
    TUESDAY: { code: "TUESDAY", name: "Thứ ba" },
    WEDNESDAY: { code: "WEDNESDAY", name: "Thứ tư" },
    THURSDAY: { code: "THURSDAY", name: "Thứ năm" },
    FRIDAY: { code: "FRIDAY", name: "Thứ sáu" },
    SATURDAY: { code: "SATURDAY", name: "Thứ bảy" },
  },

  GENDER: {
    MALE: { code: "MALE", name: "Nam" },
    FEMALE: { code: "FEMALE", name: "Nữ" },
  },

  USER_TYPE: {
    EMPLOYEE: { code: "EMPLOYEE", name: "Nhân viên", description: "" },
    ADMIN: { code: "ADMIN", name: "Admin", description: "" },
  },

  ACTION_LOG_TYPE: {
    ADD: { code: "ADD", name: "Thêm mới", type: "ThemMoi" },
    DELETE: { code: "DELETE", name: "Xoá bỏ", type: "XoaBo" },
    UPDATE: { code: "UPDATE", name: "Cập nhật", type: "CapNhat" },
    SYNC: { code: "SYNC", name: "Đồng bộ", type: "DongBo" },
    EDIT: { code: "EDIT", name: "Chỉnh sửa", type: "ChinhSua" },
    APPROVE: { code: "APPROVE", name: "Duyệt", type: "Duyet" },
    SEND_APPROVE: { code: "SEND_APPROVE", name: "Gửi Duyệt", type: "GuiDuyet" },
    REJECT: { code: "REJECT", name: "Từ chối", type: "TuChoi" },
    CANCEL: { code: "CANCEL", name: "Huỷ", type: "Huy" },
    IMPORT_EXCEL: {
      code: "IMPORT_EXCEL",
      name: "Nhập excel",
      type: "NhapExcel",
    },
    ACTIVATE: { code: "ACTIVATE", name: "Kích hoạt", type: "KichHoat" },
    DEACTIVATE: {
      code: "DEACTIVATE",
      name: "Ngưng hoạt động",
      type: "NgungHoatDong",
    },
  },

  EMPLOYEE_STATUS: {
    PENDING: { code: "PENDING", name: "Chờ duyệt", color: "#e8af4f" },
    RECRUITED: { code: "RECRUITED", name: "Đã trúng tuyển", color: "#3794bf" },
    WORKING: { code: "WORKING", name: "Đang làm việc", color: "#0b5a23" },
    STOP_WORKING: { code: "STOP_WORKING", name: "Thôi việc", color: "#f13060" },
    DEACTIVATE: {
      code: "DEACTIVATE",
      name: "Ngưng hoạt động",
      color: "#bf4537",
    },
    NOT_APPROVED: {
      code: "NOT_APPROVED",
      name: "Từ chối duyệt trúng tuyển",
      color: "red",
    },
  },

  BANNER_TYPE: {
    HOME: { code: "HOME", name: "Trang chủ" },
    ABOUT: { code: "ABOUT", name: "Giới thiệu" },
    BLOG: { code: "BLOG", name: "Blog" },
    SERVICES: { code: "SERVICES", name: "Dịch vụ" },
    TOUR: { code: "TOUR", name: "Tour" },
    BOOKING: { code: "BOOKING", name: "Đặt tour" },
    NEWS: { code: "NEWS", name: "Tin tức" },
    FAQ: { code: "FAQ", name: "Câu hỏi thường gặp" },
  },

  NEW_TYPE: {
    NEWS: { code: "NEWS", name: "Tin tức" },
    EVENT: { code: "EVENT", name: "Sự kiện" },
  },

  BLOG_STATUS: {
    NEW: { code: "NEW", name: "Mới tạo", color: "blue" },
    DRAFT: { code: "DRAFT", name: "Bản nháp", color: "orange" },
    PUBLISHED: { code: "PUBLISHED", name: "Đã xuất bản", color: "green" },
    ARCHIVED: { code: "ARCHIVED", name: "Lưu trữ", color: "gray" },
    REJECT: { code: "REJECT", name: "Từ chối xuất bản", color: "red" },
  },

  BLOG_COMMENT_STATUS: {
    PENDING: { code: "pending", name: "Chờ duyệt" },
    APPROVED: { code: "approved", name: "Đã duyệt" },
    REJECTED: { code: "rejected", name: "Từ chối" },
  },

  MONTH: {
    JANUARY: { code: 1, name: "Tháng 1" },
    FEBRUARY: { code: 2, name: "Tháng 2" },
    MARCH: { code: 3, name: "Tháng 3" },
    APRIL: { code: 4, name: "Tháng 4" },
    MAY: { code: 5, name: "Tháng 5" },
    JUNE: { code: 6, name: "Tháng 6" },
    JULY: { code: 7, name: "Tháng 7" },
    AUGUST: { code: 8, name: "Tháng 8" },
    SEPTEMBER: { code: 9, name: "Tháng 9" },
    OCTOBER: { code: 10, name: "Tháng 10" },
    NOVEMBER: { code: 11, name: "Tháng 11" },
    DECEMBER: { code: 12, name: "Tháng 12" },
  },
};

export const millisecondInDay = 86400000;

type GenderKey = keyof typeof enumData.GENDER;
export const getGenderName = (key: GenderKey): string => {
  return enumData.GENDER[key]?.name || "N/A";
};
