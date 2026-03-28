export const API_ROUTES = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4300",
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/admin/auth/login",
    LOGOUT: "/api/admin/auth/logout",
    REFRESH_TOKEN: "/api/admin/auth/refresh-token",
    ME: "/api/admin/auth/me",
    UPDATE_PASSWORD: "/api/admin/auth/update-password",
    CHANGE_PASSWORD: "/api/admin/auth/change-password",
  },

  ACTION_LOG: "/api/admin/action-log/pagination",

  NOTIFICATION: {
    PAGINATION: "/api/admin/notify/pagination",
    COUNT_UNREAD: "/api/admin/notify/find-count-notify-not-seen",
    MARK_ALL_READ: "/api/admin/notify/update-seen-all",
    MARK_READ_LIST: "/api/admin/notify/update-seen-list",
    CREATE: "/api/admin/notify/create",
    UPDATE: "/api/admin/notify/update/:id",
    DELETE: "/api/admin/notify/delete/:id",
    DETAIL: "/api/admin/notify/detail/:id",
    GET_SETTINGS: "/api/admin/notify/get-settings",
    UPDATE_SETTINGS: "/api/admin/notify/update-settings",
  },

  CUSTOMER: {
    PAGINATION: "/api/admin/customer/pagination",
    CREATE: "/api/admin/customer/create",
    UPDATE: "/api/admin/customer/update",
    ACTIVATE: "/api/admin/customer/activate",
    DEACTIVATE: "/api/admin/customer/deactivate",
    FIND_BY_ID: "/api/admin/customer/find-by-id",
    SELECT_BOX: "/api/admin/customer/select-box",
    CHANGE_PASSWORD: "/api/admin/customer/change-password",
  },

  UPLOAD_FILE: {
    SINGLE: "/api/upload/uploadFiles/upload-single",
    MULTI: "/api/upload/uploadFiles/upload-multi",
  },

  ROLE: {
    PAGINATION: "/api/admin/role/pagination",
    FIND_ALL: "/api/admin/role/find-all",
    CREATE: "/api/admin/role/create",
    UPDATE: "/api/admin/role/update",
    DEACTIVATE: "/api/admin/role/delete",
    FIND_BY_ID: "/api/admin/role/find-by-id",
    SELECT_BOX: "/api/admin/role/select-box",
    ASSIGN_PERMISSIONS: "/api/admin/role/assign-permissions",
    FIND_EMPLOYEES_BY_ROLE: "/api/admin/role/users-by-role",
  },

  TRANSLATIONS: {
    PAGINATION: "/api/admin/translations/pagination",
    CREATE: "/api/admin/translations/create",
    UPDATE: "/api/admin/translations/update",
    DELETE: "/api/admin/translations/delete",
    FIND_BY_KEY: "/api/admin/translations/find-by-key",
  },

  BANNER: {
    PAGINATION: "/api/admin/banner/pagination",
    CREATE: "/api/admin/banner/create",
    UPDATE: "/api/admin/banner/update",
    DELETE: "/api/admin/banner/delete",
    FIND_BY_ID: "/api/admin/banner/find-by-id",
    SELECT_BOX: "/api/admin/banner/select-box",
    ACTIVATE: "/api/admin/banner/activate",
    DEACTIVATE: "/api/admin/banner/deactivate",
  },

  NEWS: {
    PAGINATION: "/api/admin/news/pagination",
    CREATE: "/api/admin/news/create",
    UPDATE: "/api/admin/news/update",
    DELETE: "/api/admin/news/delete",
    FIND_BY_ID: "/api/admin/news/find-by-id",
    SELECT_BOX: "/api/admin/news/select-box",
    ACTIVATE: "/api/admin/news/activate",
    DEACTIVATE: "/api/admin/news/deactivate",
  },

  BLOG: {
    PAGINATION: "/api/admin/blog/pagination",
    SELECT_BOX: "/api/admin/blog/select-box",
    FIND_BY_ID: "/api/admin/blog/find-by-id",
    CREATE: "/api/admin/blog/create",
    UPDATE: "/api/admin/blog/update",
    DEACTIVATE: "/api/admin/blog/deactivate",
    ACTIVATE: "/api/admin/blog/activate",
    PAGINATION_BLOG_COMMENT: "/api/admin/blog/comments/pagination",
    FIND_BLOG_COMMENT_BY_ID: "/api/admin/blog/comments/find-by-id",
    APPROVE_BLOG_COMMENT: "/api/admin/blog/comments/approve",
    REJECT_BLOG_COMMENT: "/api/admin/blog/comments/reject",
    DELETE_BLOG_COMMENT: "/api/admin/blog/comments/delete",
    RESTORE_BLOG_COMMENT: "/api/admin/blog/comments/restore",
    PUBLISH_BLOG: "/api/admin/blog/publish",
    DRAFT_BLOG: "/api/admin/blog/draft",
    REJECT_BLOG: "/api/admin/blog/reject",
    ARCHIVE_BLOG: "/api/admin/blog/archive",
    UNARCHIVE_BLOG: "/api/admin/blog/unarchive",
    CHANGE_STATUS_BLOG: "/api/admin/blog/change-status",
  },

  TRAVEL_HINT: {
    PAGINATION: "/api/admin/travel-hint/pagination",
    CREATE: "/api/admin/travel-hint/create",
    UPDATE: "/api/admin/travel-hint/update",
    DELETE: "/api/admin/travel-hint/delete",
    FIND_BY_ID: "/api/admin/travel-hint/find-by-id",
    ACTIVATE: "/api/admin/travel-hint/activate",
    DEACTIVATE: "/api/admin/travel-hint/deactivate",
  },

  TOUR_GUIDE: {
    PAGINATION: "/api/admin/tour-guide/pagination",
    CREATE: "/api/admin/tour-guide/create",
    UPDATE: "/api/admin/tour-guide/update",
    ACTIVATE: "/api/admin/tour-guide/activate",
    DEACTIVATE: "/api/admin/tour-guide/deactivate",
    FIND_BY_ID: "/api/admin/tour-guide/find-by-id",
    SELECT_BOX: "/api/admin/tour-guide/select-box",
    CHANGE_PASSWORD: "/api/admin/tour-guide/change-password",
    IMPORT_EXCEL: "/api/admin/tour-guide/import-excel",
    EXPORT_EXCEL: "/api/admin/tour-guide/export-excel",
  },

  DESTINATION: {
    PAGINATION: "/api/admin/destination/pagination",
    CREATE: "/api/admin/destination/create",
    UPDATE: "/api/admin/destination/update",
    DEACTIVATE: "/api/admin/destination/deactivate",
    ACTIVATE: "/api/admin/destination/activate",
    FIND_BY_ID: "/api/admin/destination/find-by-id",
    SELECT_BOX: "/api/admin/destination/select-box",
    GET_TOUR_BY_DESTINATION: "/api/admin/destination/get-tour-by-destination",
  },

  TOUR: {
    PAGINATION: "/api/admin/tour/pagination",
    CREATE: "/api/admin/tour/create",
    UPDATE: "/api/admin/tour/update",
    DEACTIVATE: "/api/admin/tour/deactivate",
    ACTIVATE: "/api/admin/tour/activate",
    FIND_BY_ID: "/api/admin/tour/find-by-id",
    SELECT_BOX: "/api/admin/tour/select-box",
  },

  TOUR_DETAIL: {
    PAGINATION: "/api/admin/tour-detail/pagination",
    CREATE: "/api/admin/tour-detail/create",
    UPDATE: "/api/admin/tour-detail/update",
    DEACTIVATE: "/api/admin/tour-detail/deactivate",
    ACTIVATE: "/api/admin/tour-detail/activate",
    FIND_BY_ID: "/api/admin/tour-detail/find-by-id",
    SELECT_BOX: "/api/admin/tour-detail/select-box",
  },

  TOUR_PRICE: {
    PAGINATION: "/api/admin/tour-price/pagination",
    CREATE: "/api/admin/tour-price/create",
    UPDATE: "/api/admin/tour-price/update",
    DEACTIVATE: "/api/admin/tour-price/deactivate",
    ACTIVATE: "/api/admin/tour-price/activate",
    FIND_BY_ID: "/api/admin/tour-price/find-by-id",
    SELECT_BOX: "/api/admin/tour-price/select-box",
  },
};
