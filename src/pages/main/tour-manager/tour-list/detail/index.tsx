import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import GlobalLoading from "@/components/ui/Loading";
import StatusTag from "@/components/ui/StatusTag";
import { useToast } from "@/context/ToastContext";
import type { TourDetailDto } from "@/dto/tour-detail.dto";
import { useTourDetail } from "@/hooks/tour";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { useMemo, useState, type MouseEvent } from "react";
import AddTourDetailDialog from "../dialog/add-tour-detail";

// InfoRow component moved outside of render
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-3 gap-4 py-2">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="col-span-2 text-gray-900">{value || "-"}</span>
  </div>
);

export default function DetailTourPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { data: tour, isLoading, refetch } = useTourDetail(id);
  const [visible, setVisible] = useState<boolean>(false);
  const [isOpenDialogAdd, setIsOpenDialogAdd] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<TourDetailDto | null>(
    null,
  );

  const cancelAddTourDetailDialog = () => {
    setIsOpenDialogAdd(false);
  };
  const [editForm, setEditForm] = useState({
    startDay: "",
    endDay: "",
    startLocation: "",
    capacity: 0,
    status: enumData.TOUR_STATUS.DRAFT.code,
  });

  const tourStatusOptions = useMemo(
    () =>
      Object.values(enumData.TOUR_STATUS).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
    [],
  );

  const formatDateForInput = (value: Date | string | undefined) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = `${date.getMonth() + 1}`.padStart(2, "0");
    const dd = `${date.getDate()}`.padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const openEditDialog = (detail: TourDetailDto) => {
    setSelectedDetail(detail);
    setEditForm({
      startDay: formatDateForInput(detail.startDay),
      endDay: formatDateForInput(detail.endDay),
      startLocation: detail.startLocation || "",
      capacity: detail.capacity || 0,
      status: detail.status || enumData.TOUR_STATUS.DRAFT.code,
    });
    setVisible(true);
  };

  const handleUpdateDetail = async () => {
    if (!selectedDetail) return;

    if (
      !editForm.startDay ||
      !editForm.endDay ||
      !editForm.startLocation.trim()
    ) {
      showToast({
        type: "warn",
        title: "Thiếu thông tin",
        message:
          "Vui lòng nhập đầy đủ ngày bắt đầu, ngày kết thúc và điểm xuất phát",
        timeout: 3000,
      });
      return;
    }

    try {
      setIsUpdating(true);
      await rootApiService.post(API_ENDPOINTS.TOUR_DETAIL.UPDATE, {
        id: selectedDetail.id,
        startDay: editForm.startDay,
        endDay: editForm.endDay,
        startLocation: editForm.startLocation.trim(),
        capacity: editForm.capacity,
        status: editForm.status,
      });

      showToast({
        type: "success",
        title: "Thành công",
        message: "Cập nhật chi tiết tour thành công",
        timeout: 3000,
      });
      setVisible(false);
      setSelectedDetail(null);
      await refetch();
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Có lỗi xảy ra khi cập nhật chi tiết tour",
        timeout: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeactivateDetail = async (detailId: string) => {
    try {
      setDeletingId(detailId);
      await rootApiService.post(API_ENDPOINTS.TOUR_DETAIL.DEACTIVATE, {
        id: detailId,
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Vô hiệu hóa chi tiết tour thành công",
        timeout: 3000,
      });
      await refetch();
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message:
          error?.message || "Có lỗi xảy ra khi vô hiệu hóa chi tiết tour",
        timeout: 3000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleActivateDetail = async (detailId: string) => {
    try {
      setDeletingId(detailId);
      await rootApiService.post(API_ENDPOINTS.TOUR_DETAIL.ACTIVATE, {
        id: detailId,
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Kích hoạt chi tiết tour thành công",
        timeout: 3000,
      });
      await refetch();
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Có lỗi xảy ra khi kích hoạt chi tiết tour",
        timeout: 3000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const showDeactivateConfirm = (
    event: MouseEvent<HTMLElement>,
    detail: TourDetailDto,
  ) => {
    confirmPopup({
      target: event.currentTarget,
      message: `Bạn có chắc muốn vô hiệu hóa chi tiết tour ${detail.code}?`,
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Vô hiệu hóa",
      rejectLabel: "Hủy",
      accept: () => handleDeactivateDetail(detail.id),
    });
  };

  const showActivateConfirm = (
    event: MouseEvent<HTMLElement>,
    detail: TourDetailDto,
  ) => {
    confirmPopup({
      target: event.currentTarget,
      message: `Bạn có chắc muốn kích hoạt chi tiết tour ${detail.code}?`,
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-success",
      acceptLabel: "Kích hoạt",
      rejectLabel: "Hủy",
      accept: () => handleActivateDetail(detail.id),
    });
  };

  if (isLoading) {
    return <GlobalLoading />;
  }

  if (!tour) {
    return (
      <BaseView>
        <div className="text-center py-8">
          <p className="text-xl text-gray-500">Không tìm thấy tour</p>
          <Button
            label="Quay lại"
            icon="pi pi-arrow-left"
            onClick={() => router.back()}
            className="mt-4"
          />
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView>
      <ConfirmPopup />
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            icon="pi pi-plus"
            severity="secondary"
            raised
            onClick={() => setIsOpenDialogAdd(true)}
            title="Thêm chi tiết chuyến đi"
            label="Thêm chi tiết chuyến đi"
          />
        </div>
        {/* Header Card */}
        <Card title="Thông tin tour" className="shadow-sm">
          <div className="space-y-2">
            <InfoRow label="Mã tour" value={tour.code} />
            <InfoRow label="Tiêu đề" value={tour.title} />
            <InfoRow label="Slug" value={tour.slug} />
            <InfoRow label="Địa điểm" value={tour.location} />
            <InfoRow label="Thời gian" value={tour.durations} />
            <InfoRow label="Danh mục" value={tour.category} />
            <InfoRow label="Tags" value={tour.tags} />
            <InfoRow
              label="Trạng thái"
              value={
                <StatusTag
                  severity={
                    tour.status === enumData.TOUR_STATUS.ACTIVE.code
                      ? "success"
                      : "warning"
                  }
                  value={
                    Object.values(enumData.TOUR_STATUS).find(
                      (s: any) => s.code === tour.status,
                    )?.name || tour.status
                  }
                />
              }
            />
            <InfoRow
              label="Hoạt động"
              value={
                <StatusTag
                  severity={tour.isDeleted ? "danger" : "success"}
                  value={
                    tour.isDeleted
                      ? enumData.STATUS_FILTER.INACTIVE.name
                      : enumData.STATUS_FILTER.ACTIVE.name
                  }
                />
              }
            />
          </div>
        </Card>

        {/* Statistics Card */}
        <Card title="Thống kê" className="shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <i className="pi pi-star-fill text-yellow-500 text-xl" />
                <span className="text-2xl font-bold text-blue-600">
                  {tour.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Đánh giá ({tour.reviewCount || 0})
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                <i className="pi pi-eye mr-2" />
                {tour.viewCount || 0}
              </div>
              <p className="text-sm text-gray-600">Lượt xem</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                <i className="pi pi-shopping-cart mr-2" />
                {tour.bookingCount || 0}
              </div>
              <p className="text-sm text-gray-600">Lượt đặt</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                <i className="pi pi-calendar mr-2" />
                {tour.__tourDetails__?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Chuyến đi</p>
            </div>
          </div>
        </Card>

        {/* Description Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Mô tả ngắn" className="shadow-sm">
            <p className="text-gray-700 whitespace-pre-wrap">
              {tour.shortDescription || "Chưa có mô tả"}
            </p>
          </Card>

          <Card title="Điểm nổi bật" className="shadow-sm">
            <p className="text-gray-700 whitespace-pre-wrap">
              {tour.highlights || "Chưa có thông tin"}
            </p>
          </Card>
        </div>

        <Card title="Mô tả chi tiết" className="shadow-sm">
          <p className="text-gray-700 whitespace-pre-wrap">
            {tour.longDescription || "Chưa có mô tả chi tiết"}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Dịch vụ bao gồm" className="shadow-sm">
            <p className="text-gray-700 whitespace-pre-wrap">
              {tour.included || "Chưa có thông tin"}
            </p>
          </Card>

          <Card title="Dịch vụ không bao gồm" className="shadow-sm">
            <p className="text-gray-700 whitespace-pre-wrap">
              {tour.excluded || "Chưa có thông tin"}
            </p>
          </Card>
        </div>

        {/* Tour Details List */}
        {tour.__tourDetails__ && tour.__tourDetails__.length > 0 && (
          <Card title="Chi tiết chuyến đi" className="shadow-sm">
            <div className="space-y-4">
              {tour.__tourDetails__?.map((detail, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-end gap-3">
                    <Button
                      icon="pi pi-pen-to-square"
                      severity="secondary"
                      onClick={() => openEditDialog(detail)}
                      className="w-10 h-10"
                    />
                    {detail.status === enumData.TOUR_STATUS.ACTIVE.code ? (
                      <Button
                        icon="pi pi-pause-circle"
                        severity="danger"
                        onClick={(event) =>
                          showDeactivateConfirm(event, detail)
                        }
                        loading={deletingId === detail.id}
                        size="small"
                      />
                    ) : (
                      <Button
                        icon="pi pi-play-circle"
                        onClick={(event) => showActivateConfirm(event, detail)}
                        severity="success"
                        loading={deletingId === detail.id}
                        size="small"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="font-semibold">Mã: </span>
                      {detail.code}
                    </div>
                    <div>
                      <span className="font-semibold">Ngày bắt đầu: </span>
                      {new Date(detail.startDay).toLocaleDateString("vi-VN")}
                    </div>
                    <div>
                      <span className="font-semibold">Ngày kết thúc: </span>
                      {new Date(detail.endDay).toLocaleDateString("vi-VN")}
                    </div>
                    <div>
                      <span className="font-semibold">Sức chứa: </span>
                      {detail.capacity}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">Điểm xuất phát: </span>
                      {detail.startLocation}
                    </div>
                    <div>
                      <span className="font-semibold">Còn lại: </span>
                      {detail.remainingSeats}
                    </div>
                    <div>
                      <span className="font-semibold">Trạng thái: </span>
                      <StatusTag
                        severity={
                          detail.status === enumData.TOUR_STATUS.ACTIVE.code
                            ? "success"
                            : "warning"
                        }
                        value={detail.status}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Divider />

        <Dialog
          header="Chỉnh sửa chi tiết chuyến đi"
          visible={visible}
          onHide={() => {
            setVisible(false);
            setSelectedDetail(null);
          }}
          style={{ width: "650px", maxWidth: "95vw" }}
          footer={
            <div className="flex justify-end gap-2 pt-5">
              <Button
                label="Hủy"
                severity="secondary"
                onClick={() => {
                  setVisible(false);
                  setSelectedDetail(null);
                }}
              />
              <Button
                label="Lưu"
                icon="pi pi-check"
                severity="success"
                loading={isUpdating}
                onClick={handleUpdateDetail}
              />
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-medium text-gray-700">
                Mã chi tiết tour
              </label>
              <InputText
                value={selectedDetail?.code || ""}
                disabled
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">Trạng thái</label>
              <Dropdown
                value={editForm.status}
                options={tourStatusOptions}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, status: e.value }))
                }
                className="w-full"
                placeholder="Chọn trạng thái"
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">Ngày bắt đầu</label>
              <InputText
                type="date"
                value={editForm.startDay}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, startDay: e.target.value }))
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">Ngày kết thúc</label>
              <InputText
                type="date"
                value={editForm.endDay}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, endDay: e.target.value }))
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="font-medium text-gray-700">
                Điểm xuất phát
              </label>
              <InputText
                value={editForm.startLocation}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    startLocation: e.target.value,
                  }))
                }
                className="w-full"
                placeholder="Nhập điểm xuất phát"
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">Sức chứa</label>
              <InputNumber
                value={editForm.capacity}
                onValueChange={(e) =>
                  setEditForm((prev) => ({ ...prev, capacity: e.value || 0 }))
                }
                className="w-full"
                useGrouping={false}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">
                Số ghế còn lại
              </label>
              <InputNumber
                value={selectedDetail?.remainingSeats || 0}
                className="w-full"
                disabled
                useGrouping={false}
              />
            </div>
          </div>
        </Dialog>

        <AddTourDetailDialog
          isOpenDialogAdd={isOpenDialogAdd}
          onCancel={cancelAddTourDetailDialog}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            label="Quay lại"
            icon="pi pi-arrow-left"
            severity="secondary"
            onClick={() => router.back()}
          />
          <Button
            label="Chỉnh sửa"
            icon="pi pi-pencil"
            severity="success"
            onClick={() =>
              router.push(`/main/tour-manager/tour-list/edit/${tour.id}`)
            }
          />
        </div>
      </div>
    </BaseView>
  );
}
