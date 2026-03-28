import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import GlobalLoading from "@/components/ui/Loading";
import StatusTag from "@/components/ui/StatusTag";
import type { TourDetailDto } from "@/dto/tour-detail.dto";
import { useTourDetail } from "@/hooks/tour";
import { useRouter } from "@/routers/hooks";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useParams } from "react-router-dom";

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

export default function DetailTourPricePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: tour, isLoading } = useTourDetail(id);

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
      <div className="space-y-4">
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
              {tour.__tourDetails__.map(
                (detail: TourDetailDto, index: number) => (
                  <div key={index} className="border p-4 rounded-lg">
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
                ),
              )}
            </div>
          </Card>
        )}

        <Divider />

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
