export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      translationKey: "auth.login",
      path: "/login",
      isShow: false,
    },
  },

  OTHER: {
    NOTIFICATION: {
      key: "NOTIFICATION",
      translationKey: "menu.notification",
      path: "/notifications",
      isShow: false,
    },
  },

  MAIN: {
    HOME: {
      key: "HOME",
      translationKey: "menu.home",
      path: "/",
      icon: "pi pi-home",
    },

    // Quản lý người dùng
    USER_MANAGER: {
      key: "USER_MANAGER",
      translationKey: "menu.userManager",
      icon: "pi pi-user",
      path: "/user-manager",
      children: {
        STUDENT_MANAGER: {
          key: "STUDENT_MANAGER",
          translationKey: "menu.studentManager",
          path: "/student-manager",
          children: {
            ADD_STUDENT: {
              key: "ADD_STUDENT",
              translationKey: "student.add",
              path: "/student/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_STUDENT: {
              key: "EDIT_STUDENT",
              translationKey: "student.edit",
              path: "/student/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_STUDENT: {
              key: "DETAIL_STUDENT",
              translationKey: "student.detail",
              path: "/student/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
        TEACHER_MANAGER: {
          key: "TEACHER_MANAGER",
          translationKey: "menu.teacherManager",
          path: "/teacher-manager",
          children: {
            ADD_TEACHER: {
              key: "ADD_TEACHER",
              translationKey: "teacher.add",
              path: "/teacher/add",
              icon: "pi pi-plus-circle",
              isShow: false,
            },
            EDIT_TEACHER: {
              key: "EDIT_TEACHER",
              translationKey: "teacher.edit",
              path: "/teacher/edit/:id",
              icon: "pi pi-pencil-circle",
              isShow: false,
            },
            DETAIL_TEACHER: {
              key: "DETAIL_TEACHER",
              translationKey: "teacher.detail",
              path: "/teacher/detail/:id",
              icon: "pi pi-info-circle",
              isShow: false,
            },
          },
        },
      },
    },

    // Quản lý tin tức
    NEW_MANAGER: {
      key: "NEW_MANAGER",
      translationKey: "menu.newManager",
      icon: "pi pi-images",
      path: "/new-manager",
      children: {
        // Banner
        BANNER_MANAGER: {
          key: "BANNER_MANAGER",
          translationKey: "menu.bannerManager",
          path: "/banner-manager",
          children: {
            ADD_BANNER: {
              key: "ADD_BANNER",
              translationKey: "menu.addBanner",
              path: "/banner/add",
              isShow: false,
            },
            EDIT_BANNER: {
              key: "EDIT_BANNER",
              translationKey: "menu.editBanner",
              path: "/banner/edit/:id",
              isShow: false,
            },
            DETAIL_BANNER: {
              key: "DETAIL_BANNER",
              translationKey: "menu.detailBanner",
              path: "/banner/detail/:id",
              isShow: false,
            },
          },
        },
        NEW_LIST: {
          key: "NEW_LIST",
          translationKey: "menu.newManager",
          path: "/new-list",
          children: {
            ADD_NEW: {
              key: "ADD_NEW",
              translationKey: "menu.addNew",
              path: "/new/add",
              isShow: false,
            },
            EDIT_NEW: {
              key: "EDIT_NEW",
              translationKey: "menu.editNew",
              path: "/new/edit/:id",
              isShow: false,
            },
            DETAIL_NEW: {
              key: "DETAIL_NEW",
              translationKey: "menu.detailNew",
              path: "/new/detail/:id",
              isShow: false,
            },
          },
        },
        BLOG_MANAGER: {
          key: "BLOG_MANAGER",
          translationKey: "menu.blogManager",
          path: "/blog-manager",
          children: {
            ADD_BLOG: {
              key: "ADD_BLOG",
              translationKey: "menu.addBlog",
              path: "/blog/add",
              isShow: false,
            },
            EDIT_BLOG: {
              key: "EDIT_BLOG",
              translationKey: "menu.editBlog",
              path: "/blog/edit/:id",
              isShow: false,
            },
            DETAIL_BLOG: {
              key: "DETAIL_BLOG",
              translationKey: "menu.detailBlog",
              path: "/blog/detail/:id",
              isShow: false,
            },
          },
        },
      },
    },

    // Quản lý vai trò - quyền
    ROLE_MANAGER: {
      key: "ROLE_MANAGER",
      translationKey: "menu.roleManager",
      icon: "pi pi-shield",
      children: {
        ROLE_MANAGER: {
          key: "ROLE_MANAGER",
          translationKey: "menu.role",
          path: "/role",
          children: {
            ADD_ROLE: {
              key: "ADD_ROLE",
              translationKey: "role.add",
              path: "/role/add",
              isShow: false,
            },
            EDIT_ROLE: {
              key: "EDIT_ROLE",
              translationKey: "role.edit",
              path: "/role/edit",
              isShow: false,
            },
            DETAIL_ROLE: {
              key: "DETAIL_ROLE",
              translationKey: "role.detail",
              path: "/role/detail",
              isShow: false,
            },
          },
        },
        ASSIGN_PERMISSION: {
          key: "ASSIGN_PERMISSION",
          translationKey: "menu.roleManager",
          path: "/assign-permission",
          isShow: true,
        },
      },
    },

    SETTING_SYSTEM: {
      key: "SETTING_SYSTEM",
      translationKey: "menu.systemSettings",
      icon: "pi pi-cog",
      children: {
        SETTING_LANGUAGE: {
          key: "SETTING_LANGUAGE",
          translationKey: "settings.language",
          path: "setting-system/setting-language",
        },
        SETTING_STRING: {
          key: "SETTING_STRING",
          translationKey: "settings.dynamicConfig",
          path: "setting-system/setting-string",
        },
      },
    },
  },
};
