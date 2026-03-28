import { ROUTES } from "@/common/constants";
import { AuthGuard } from "@/components/ui/wrappers/AuthGuard";
import AppLayout from "@/layout/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/main/dashboard";

import BannerManager from "@/pages/main/news-manager/banners";
import AddBannerPage from "@/pages/main/news-manager/banners/add";
import DetailBannerPage from "@/pages/main/news-manager/banners/detail";
import EditBannerPage from "@/pages/main/news-manager/banners/edit";
import BlogManager from "@/pages/main/news-manager/blogs";
import AddBlogPage from "@/pages/main/news-manager/blogs/add";
import DetailBlogPage from "@/pages/main/news-manager/blogs/detail";
import EditBlogPage from "@/pages/main/news-manager/blogs/edit";
import NewManager from "@/pages/main/news-manager/news";
import AddNewPage from "@/pages/main/news-manager/news/add";
import DetailNewPage from "@/pages/main/news-manager/news/detail";
import EditNewPage from "@/pages/main/news-manager/news/edit";
import SettingLanguagePage from "@/pages/main/setting-system/setting-language";
import NotFound from "@/pages/other/NotFound";
import NotificationListPage from "@/pages/other/NotificationList";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route công khai */}
      <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />

      {/* Route bảo vệ */}
      <Route>
        <Route element={<AppLayout />}>
          <Route index path={ROUTES.MAIN.HOME.path} element={<Dashboard />} />

          <Route
            path={ROUTES.OTHER.NOTIFICATION.path}
            element={<NotificationListPage />}
          />

          {/* Quản lý banner*/}
          <Route
            path={ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.path}
            element={
              <AuthGuard>
                <BannerManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children
                .ADD_BANNER.path
            }
            element={
              <AuthGuard>
                <AddBannerPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children
                .EDIT_BANNER.path
            }
            element={
              <AuthGuard>
                <EditBannerPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BANNER_MANAGER.children
                .DETAIL_BANNER.path
            }
            element={
              <AuthGuard>
                <DetailBannerPage />
              </AuthGuard>
            }
          />

          {/* Quản lý tin tức*/}
          <Route
            path={ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.path}
            element={
              <AuthGuard>
                <NewManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.ADD_NEW.path
            }
            element={
              <AuthGuard>
                <AddNewPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.EDIT_NEW.path
            }
            element={
              <AuthGuard>
                <EditNewPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.NEW_LIST.children.DETAIL_NEW.path
            }
            element={
              <AuthGuard>
                <DetailNewPage />
              </AuthGuard>
            }
          />

          {/* Quản lý bài viết*/}
          <Route
            path={ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.path}
            element={
              <AuthGuard>
                <BlogManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.ADD_BLOG
                .path
            }
            element={
              <AuthGuard>
                <AddBlogPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.EDIT_BLOG
                .path
            }
            element={
              <AuthGuard>
                <EditBlogPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.BLOG_MANAGER.children.DETAIL_BLOG
                .path
            }
            element={
              <AuthGuard>
                <DetailBlogPage />
              </AuthGuard>
            }
          />

          {/* Quản lý học viên */}
          {/* Quản lý giáo viên */}
          {/* Quản lý vai trò */}
          {/* Phân quyền */}
          {/* Thiết lập động */}
          {/* Thiết lập ngôn ngữ */}
          <Route
            path={ROUTES.MAIN.SETTING_SYSTEM.children.SETTING_LANGUAGE.path}
            element={
              <AuthGuard>
                <SettingLanguagePage />
              </AuthGuard>
            }
          />
        </Route>
      </Route>

      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
