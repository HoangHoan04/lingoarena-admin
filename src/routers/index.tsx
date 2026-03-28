import { ROUTES } from "@/common/constants/routes";
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
import TravelHintManager from "@/pages/main/news-manager/travel-hint";
import AddTravelHintPage from "@/pages/main/news-manager/travel-hint/add";
import DetailTravelHintPage from "@/pages/main/news-manager/travel-hint/detail";
import EditTravelHintPage from "@/pages/main/news-manager/travel-hint/edit";
import PermissionAssignmentPage from "@/pages/main/role-manager/perrmission-assign";
import RoleManagerPage from "@/pages/main/role-manager/role";
import DestinationManager from "@/pages/main/tour-manager/destinations";
import AddDestinationPage from "@/pages/main/tour-manager/destinations/add";
import DetailDestinationPage from "@/pages/main/tour-manager/destinations/detail";
import EditDestinationPage from "@/pages/main/tour-manager/destinations/edit";
import TourManager from "@/pages/main/tour-manager/tour-list";
import AddTourPage from "@/pages/main/tour-manager/tour-list/add";
import DetailTourPage from "@/pages/main/tour-manager/tour-list/detail";
import EditTourPage from "@/pages/main/tour-manager/tour-list/edit";
import TourPriceManager from "@/pages/main/tour-manager/tour-price";
import AddTourPricePage from "@/pages/main/tour-manager/tour-price/add";
import DetailTourPricePage from "@/pages/main/tour-manager/tour-price/detail";
import EditTourPricePage from "@/pages/main/tour-manager/tour-price/edit";
import CustomerManager from "@/pages/main/user-manager/customer-manager";
import AddCustomerPage from "@/pages/main/user-manager/customer-manager/add";
import DetailCustomerPage from "@/pages/main/user-manager/customer-manager/detail";
import EditCustomerPage from "@/pages/main/user-manager/customer-manager/edit";
import TourGuideManager from "@/pages/main/user-manager/tour-guide-manager";
import AddTourGuidePage from "@/pages/main/user-manager/tour-guide-manager/add";
import DetailTourGuidePage from "@/pages/main/user-manager/tour-guide-manager/detail";
import EditTourGuidePage from "@/pages/main/user-manager/tour-guide-manager/edit";
import NotFound from "@/pages/other/NotFound";
import NotificationListPage from "@/pages/other/NotificationList";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route công khai */}
      <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />

      {/* Route bảo vệ */}
      <Route element={<PrivateRoute />}>
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

          {/* Quản lý tour*/}
          <Route
            path={ROUTES.MAIN.TOUR_MANAGER.children.TOUR_LIST.path}
            element={
              <AuthGuard>
                <TourManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.TOUR_LIST.children.ADD_TOUR.path
            }
            element={
              <AuthGuard>
                <AddTourPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.TOUR_LIST.children.EDIT_TOUR
                .path
            }
            element={
              <AuthGuard>
                <EditTourPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.TOUR_LIST.children.DETAIL_TOUR
                .path
            }
            element={
              <AuthGuard>
                <DetailTourPage />
              </AuthGuard>
            }
          />

          {/* Quản lý giá tour */}
          <Route
            path={ROUTES.MAIN.TOUR_MANAGER.children.TOUR_PRICE_MANAGER.path}
            element={
              <AuthGuard>
                <TourPriceManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.TOUR_PRICE_MANAGER.children
                .ADD_TOUR_PRICE.path
            }
            element={
              <AuthGuard>
                <AddTourPricePage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.TOUR_PRICE_MANAGER.children
                .EDIT_TOUR_PRICE.path
            }
            element={
              <AuthGuard>
                <EditTourPricePage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.TOUR_PRICE_MANAGER.children
                .DETAIL_TOUR_PRICE.path
            }
            element={
              <AuthGuard>
                <DetailTourPricePage />
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

          {/* Quản lý địa điểm gợi ý*/}
          <Route
            path={ROUTES.MAIN.NEW_MANAGER.children.TRAVEL_HINT_MANAGER.path}
            element={
              <AuthGuard>
                <TravelHintManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.TRAVEL_HINT_MANAGER.children
                .ADD_TRAVEL_HINT.path
            }
            element={
              <AuthGuard>
                <AddTravelHintPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.TRAVEL_HINT_MANAGER.children
                .EDIT_TRAVEL_HINT.path
            }
            element={
              <AuthGuard>
                <EditTravelHintPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.NEW_MANAGER.children.TRAVEL_HINT_MANAGER.children
                .DETAIL_TRAVEL_HINT.path
            }
            element={
              <AuthGuard>
                <DetailTravelHintPage />
              </AuthGuard>
            }
          />

          {/* Quản lý điểm đến*/}
          <Route
            path={ROUTES.MAIN.TOUR_MANAGER.children.DESTINATION_MANAGER.path}
            element={
              <AuthGuard>
                <DestinationManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.DESTINATION_MANAGER.children
                .ADD_DESTINATION.path
            }
            element={
              <AuthGuard>
                <AddDestinationPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.DESTINATION_MANAGER.children
                .EDIT_DESTINATION.path
            }
            element={
              <AuthGuard>
                <EditDestinationPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.TOUR_MANAGER.children.DESTINATION_MANAGER.children
                .DETAIL_DESTINATION.path
            }
            element={
              <AuthGuard>
                <DetailDestinationPage />
              </AuthGuard>
            }
          />

          {/* Quản lý khách hàng */}
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.path}
            element={
              <AuthGuard>
                <CustomerManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .ADD_CUSTOMER.path
            }
            element={
              <AuthGuard>
                <AddCustomerPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .EDIT_CUSTOMER.path
            }
            element={
              <AuthGuard>
                <EditCustomerPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .DETAIL_CUSTOMER.path
            }
            element={
              <AuthGuard>
                <DetailCustomerPage />
              </AuthGuard>
            }
          />

          {/* Quản lý hướng dẫn viên */}
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.path}
            element={
              <AuthGuard>
                <TourGuideManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children
                .ADD_TOUR_GUIDE.path
            }
            element={
              <AuthGuard>
                <AddTourGuidePage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children
                .EDIT_TOUR_GUIDE.path
            }
            element={
              <AuthGuard>
                <EditTourGuidePage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children
                .DETAIL_TOUR_GUIDE.path
            }
            element={
              <AuthGuard>
                <DetailTourGuidePage />
              </AuthGuard>
            }
          />

          {/* Vai trò */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_MANAGER.path}
            element={
              <AuthGuard requiredPermission="ROLE:VIEW">
                <RoleManagerPage />
              </AuthGuard>
            }
          />

          {/* Phân quyền */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ASSIGN_PERMISSION.path}
            element={
              <AuthGuard requiredPermission="PERMISSION:ASSIGN">
                <PermissionAssignmentPage />
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
