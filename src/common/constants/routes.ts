export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      label: "Đăng nhập",
      path: "/login",
      isShow: false,
    },
  },

  OTHER: {
    NOTIFICATION: {
      key: "NOTIFICATION",
      label: "Thông báo",
      path: "/notifications",
      isShow: false,
    },
  },

  MAIN: {
    HOME: {
      key: "HOME",
      label: "Trang chủ",
      path: "/",
      icon: "pi pi-home",
    },

    // Quản lý người dùng
    USER_MANAGER: {
      key: "USER_MANAGER",
      label: "Quản lý người dùng",
      icon: "pi pi-user",
      path: "/user-manager",
      children: {
        CUSTOMER_MANAGER: {
          key: "CUSTOMER_MANAGER",
          label: "Quản lý khách hàng",
          path: "/customer-manager",
          children: {
            ADD_CUSTOMER: {
              key: "ADD_CUSTOMER",
              label: "Thêm khách hàng",
              path: "/customer/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_CUSTOMER: {
              key: "EDIT_CUSTOMER",
              label: "Chỉnh sửa khách hàng",
              path: "/customer/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_CUSTOMER: {
              key: "DETAIL_CUSTOMER",
              label: "Chi tiết khách hàng",
              path: "/customer/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
        TOUR_GUIDE_MANAGER: {
          key: "TOUR_GUIDE_MANAGER",
          label: "Quản lý hướng dẫn viên",
          path: "/tourguide-manager",
          children: {
            ADD_TOUR_GUIDE: {
              key: "ADD_TOUR_GUIDE",
              label: "Thêm hướng dẫn viên",
              path: "/tourguide/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_TOUR_GUIDE: {
              key: "EDIT_TOUR_GUIDE",
              label: "Chỉnh sửa hướng dẫn viên",
              path: "/tourguide/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_TOUR_GUIDE: {
              key: "DETAIL_TOUR_GUIDE",
              label: "Chi tiết hướng dẫn viên",
              path: "/tourguide/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
      },
    },

    // Quản lý tour
    TOUR_MANAGER: {
      key: "TOUR_MANAGER",
      label: "Quản lý tour",
      icon: "pi pi-users",
      path: "/tour-manager",
      children: {
        TOUR_LIST: {
          key: "TOUR_LIST",
          label: "Danh sách tour",
          path: "/tour-list",
          children: {
            ADD_TOUR: {
              key: "ADD_TOUR",
              label: "Thêm tour",
              path: "/tour/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_TOUR: {
              key: "EDIT_TOUR",
              label: "Chỉnh sửa tour",
              path: "/tour/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_TOUR: {
              key: "DETAIL_TOUR",
              label: "Chi tiết tour",
              path: "/tour/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },

        TOUR_DETAIL_MANAGER: {
          key: "TOUR_DETAIL_MANAGER",
          label: "Quản lý chi tiết tour",
          path: "/tour-detail-manager",
          children: {
            ADD_TOUR_DETAIL: {
              key: "ADD_TOUR_DETAIL",
              label: "Thêm chi tiết tour",
              path: "/tour-detail/add",
              isShow: false,
            },
            EDIT_TOUR_DETAIL: {
              key: "EDIT_TOUR_DETAIL",
              label: "Chỉnh sửa chi tiết tour",
              path: "/tour-detail/edit/:id",
              isShow: false,
            },
            DETAIL_TOUR_DETAIL: {
              key: "DETAIL_TOUR_DETAIL",
              label: "Chi tiết chi tiết tour",
              path: "/tour-detail/detail/:id",
              isShow: false,
            },
          },
        },
        TOUR_PRICE_MANAGER: {
          key: "TOUR_PRICE_MANAGER",
          label: "Quản lý giá tour",
          path: "/tour-price-manager",
          children: {
            ADD_TOUR_PRICE: {
              key: "ADD_TOUR_PRICE",
              label: "Thêm giá tour",
              path: "/tour-price/add",
              isShow: false,
            },
            EDIT_TOUR_PRICE: {
              key: "EDIT_TOUR_PRICE",
              label: "Chỉnh sửa giá tour",
              path: "/tour-price/edit/:id",
              isShow: false,
            },
            DETAIL_TOUR_PRICE: {
              key: "DETAIL_TOUR_PRICE",
              label: "Chi tiết giá tour",
              path: "/tour-price/detail/:id",
              isShow: false,
            },
          },
        },

        DESTINATION_MANAGER: {
          key: "DESTINATION_MANAGER",
          label: "Quản lý điểm đến",
          path: "/destination-manager",
          children: {
            ADD_DESTINATION: {
              key: "ADD_DESTINATION",
              label: "Thêm điểm đến",
              path: "/destination-manager/add",
              isShow: false,
            },
            EDIT_DESTINATION: {
              key: "EDIT_DESTINATION",
              label: "Chỉnh sửa điểm đến",
              path: "/destination-manager/edit/:id",
              isShow: false,
            },
            DETAIL_DESTINATION: {
              key: "DETAIL_DESTINATION",
              label: "Chi tiết điểm đến",
              path: "/destination-manager/detail/:id",
              isShow: false,
            },
          },
        },
        BOOKING_MANAGER: {
          key: "BOOKING_MANAGER",
          label: "Quản lý đặt chỗ",
          path: "/booking-manager",
          children: {
            ADD_BOOKING: {
              key: "ADD_BOOKING",
              label: "Thêm đặt chỗ",
              path: "/booking-manager/add",
              isShow: false,
            },
            EDIT_BOOKING: {
              key: "EDIT_BOOKING",
              label: "Chỉnh sửa đặt chỗ",
              path: "/booking-manager/edit/:id",
              isShow: false,
            },
            DETAIL_BOOKING: {
              key: "DETAIL_BOOKING",
              label: "Chi tiết đặt chỗ",
              path: "/booking-manager/detail/:id",
              isShow: false,
            },
          },
        },
      },
    },

    // Quản lý tin tức
    NEW_MANAGER: {
      key: "NEW_MANAGER",
      label: "Quản lý tin tức",
      icon: "pi pi-images",
      path: "/new-manager",
      children: {
        // Banner
        BANNER_MANAGER: {
          key: "BANNER_MANAGER",
          label: "Quản lý banner",
          path: "/banner-manager",
          children: {
            ADD_BANNER: {
              key: "ADD_BANNER",
              label: "Thêm banner",
              path: "/banner/add",
              isShow: false,
            },
            EDIT_BANNER: {
              key: "EDIT_BANNER",
              label: "Chỉnh sửa banner",
              path: "/banner/edit/:id",
              isShow: false,
            },
            DETAIL_BANNER: {
              key: "DETAIL_BANNER",
              label: "Chi tiết banner",
              path: "/banner/detail/:id",
              isShow: false,
            },
          },
        },
        NEW_LIST: {
          key: "NEW_LIST",
          label: "Quản lý tin tức",
          path: "/new-list",
          children: {
            ADD_NEW: {
              key: "ADD_NEW",
              label: "Thêm tin tức",
              path: "/new/add",
              isShow: false,
            },
            EDIT_NEW: {
              key: "EDIT_NEW",
              label: "Chỉnh sửa tin tức",
              path: "/new/edit/:id",
              isShow: false,
            },
            DETAIL_NEW: {
              key: "DETAIL_NEW",
              label: "Chi tiết tin tức",
              path: "/new/detail/:id",
              isShow: false,
            },
          },
        },
        BLOG_MANAGER: {
          key: "BLOG_MANAGER",
          label: "Quản lý blog",
          path: "/blog-manager",
          children: {
            ADD_BLOG: {
              key: "ADD_BLOG",
              label: "Thêm blog",
              path: "/blog/add",
              isShow: false,
            },
            EDIT_BLOG: {
              key: "EDIT_BLOG",
              label: "Chỉnh sửa blog",
              path: "/blog/edit/:id",
              isShow: false,
            },
            DETAIL_BLOG: {
              key: "DETAIL_BLOG",
              label: "Chi tiết blog",
              path: "/blog/detail/:id",
              isShow: false,
            },
          },
        },
        TRAVEL_HINT_MANAGER: {
          key: "TRAVEL_HINT_MANAGER",
          label: "Quản lý gợi ý điểm du lịch",
          path: "/travel-hint-manager",
          children: {
            ADD_TRAVEL_HINT: {
              key: "ADD_TRAVEL_HINT",
              label: "Thêm gợi ý điểm du lịch",
              path: "/travel-hint/add",
              isShow: false,
            },
            EDIT_TRAVEL_HINT: {
              key: "EDIT_TRAVEL_HINT",
              label: "Chỉnh sửa gợi ý điểm du lịch",
              path: "/travel-hint/edit/:id",
              isShow: false,
            },
            DETAIL_TRAVEL_HINT: {
              key: "DETAIL_TRAVEL_HINT",
              label: "Chi tiết gợi ý điểm du lịch",
              path: "/travel-hint/detail/:id",
              isShow: false,
            },
          },
        },
      },
    },

    // Quản lý vai trò - quyền
    ROLE_MANAGER: {
      key: "ROLE_MANAGER",
      label: "Quản lý vai trò",
      icon: "pi pi-shield",
      children: {
        ROLE_MANAGER: {
          key: "ROLE_MANAGER",
          label: "Vai trò",
          path: "/role",
          children: {
            ADD_ROLE: {
              key: "ADD_ROLE",
              label: "Thêm vai trò",
              path: "/role/add",
              isShow: false,
            },
            EDIT_ROLE: {
              key: "EDIT_ROLE",
              label: "Chỉnh sửa vai trò",
              path: "/role/edit/:id",
              isShow: false,
            },
            DETAIL_ROLE: {
              key: "DETAIL_ROLE",
              label: "Chi tiết vai trò",
              path: "/role/detail/:id",
              isShow: false,
            },
          },
        },
        ASSIGN_PERMISSION: {
          key: "ASSIGN_PERMISSION",
          label: "Phân quyền",
          path: "/assign-permission",
          isShow: true,
        },
      },
    },
  },
};
