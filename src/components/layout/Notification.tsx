import { loading } from "@/assets/animations";
import { ROUTES } from "@/common/constants/routes";
import { formatTimeAgo } from "@/common/helpers/format";
import {
  useMarkAllRead,
  useMarkReadList,
  usePaginationNotification,
  useUnreadCount,
} from "@/hooks/notification";
import { useRouter } from "@/routers/hooks";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { type FC, useRef } from "react";

const Notification: FC = () => {
  const op = useRef<OverlayPanel>(null);
  const router = useRouter();
  const { count: unreadCount } = useUnreadCount();
  const { data: notifications, refetch } = usePaginationNotification({
    skip: 0,
    take: 20,
    where: {},
  });
  const { onMarkReadList } = useMarkReadList();
  const { onMarkAllRead } = useMarkAllRead();

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      onMarkReadList([id]);
    }
  };

  const handleViewAll = () => {
    op.current?.hide();
    router.push(ROUTES.OTHER.NOTIFICATION.path);
  };

  const getIconByType = (type: string) => {
    const lowerType = type?.toLowerCase() || "info";

    if (lowerType.includes("warn") || lowerType.includes("cảnh báo"))
      return "pi pi-exclamation-triangle text-yellow-500";
    if (lowerType.includes("error") || lowerType.includes("lỗi"))
      return "pi pi-times-circle text-red-500";
    if (lowerType.includes("success") || lowerType.includes("thành công"))
      return "pi pi-check-circle text-green-500";

    return "pi pi-info-circle text-blue-500";
  };

  return (
    <>
      <div className="relative inline-block">
        <Button
          icon="pi pi-bell"
          rounded
          text
          onClick={(e) => op.current?.toggle(e)}
          tooltip="Thông báo"
          tooltipOptions={{ position: "bottom" }}
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        />
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 99 ? "99+" : unreadCount}
            severity="danger"
            className="absolute top-0 right-0 pointer-events-none origin-center scale-75"
          />
        )}
      </div>

      <OverlayPanel ref={op} className="w-96 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 mb-3 border-b ">
            <h3 className="text-lg font-semibold m-0 ">Thông báo</h3>
            <div className="flex gap-1">
              <Button
                icon={`pi ${loading ? "pi-spin pi-spinner" : "pi-refresh"}`}
                rounded
                text
                severity="secondary"
                size="small"
                onClick={() => refetch()}
                tooltip="Làm mới"
              />
              <Button
                onClick={() => onMarkAllRead()}
                icon="pi pi-check-square"
                rounded
                text
                severity="secondary"
                size="small"
                tooltip="Đánh dấu tất cả là đã đọc"
                disabled={unreadCount === 0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 max-h-100 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center ">
                <i className="pi pi-inbox text-4xl mb-3 opacity-30" />
                <p className="m-0 text-sm">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.isRead,
                    )
                  }
                  className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all group ${
                    notification.isRead
                      ? "opacity-75 bg-transparent"
                      : " shadow-sm bg-transparent"
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    <i
                      className={`${getIconByType(notification.type ?? notification.notificationType)} text-xl`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={`font-semibold text-sm m-0 truncate ${
                          !notification.isRead
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5 shadow-sm" />
                      )}
                    </div>
                    <p className="text-sm m-0 mb-1  ">{notification.content}</p>
                    <span className="text-xs block mt-1">
                      {formatTimeAgo(
                        notification.publishDate ?? notification.createdAt,
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100">
            <Button
              label="Xem tất cả"
              text
              size="small"
              className="w-full text-blue-600 hover:bg-blue-50"
              onClick={handleViewAll}
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

export default Notification;
