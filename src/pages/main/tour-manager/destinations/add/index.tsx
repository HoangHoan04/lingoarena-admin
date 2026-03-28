import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { DestinationDto } from "@/dto/destination.dto";
import { useCreateDestination } from "@/hooks/destination";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddDestinationPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới điểm đến",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: DestinationDto;
  isEdit?: boolean;
  handleUpdate?: (data: DestinationDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateDestination } = useCreateDestination();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã điểm đến",
        type: "input",
        placeholder: "Mã điểm đến được hệ thống tự động tạo",
        disabled: true,
      },
      {
        name: "slug",
        label: "Đường dẫn điểm đến",
        type: "input",
        placeholder: "Đường dẫn điểm đến được hệ thống tự động tạo",
        disabled: true,
      },
      {
        name: "name",
        label: "Tên điểm đến",
        type: "input",
        required: true,
        placeholder: "Nhập tên điểm đến",
      },
      {
        name: "country",
        label: "Quốc gia",
        type: "input",
        required: true,
        placeholder: "Nhập tên quốc gia",
      },
      {
        name: "region",
        label: "Vùng miền",
        type: "input",
        required: true,
        placeholder: "Nhập vùng miền",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "input",
        required: true,
        placeholder: "Nhập mô tả",
      },
      {
        name: "latitude",
        label: "Vĩ độ",
        type: "input",
        required: true,
        placeholder: "Nhập vĩ độ",
      },
      {
        name: "longitude",
        label: "Kinh độ",
        type: "input",
        required: true,
        placeholder: "Nhập kinh độ",
      },
      {
        name: "bestTimeToVisit",
        label: "Thời gian tốt nhất để tham quan",
        type: "select",
        options: Object.values(enumData.MONTH || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        placeholder: "Chọn thời gian tốt nhất để tham quan",
      },

      {
        name: "averageTemperature",
        label: "Nhiệt độ trung bình",
        type: "input",
        placeholder: "Nhập nhiệt độ trung bình",
      },
      {
        name: "popularActivities",
        label: "Các hoạt động phổ biến",
        type: "multiselect",
        placeholder: "Nhập các hoạt động phổ biến",
        options: [],
      },
      {
        name: "image",
        label: "Hình ảnh điểm đến",
        type: "image",
        isSingle: true,
        required: false,
        gridColumn: "span 3",
      },
    ];
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateDestination(values);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        showDivider={true}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={goBack || onCancel}
        submitText="Lưu"
        cancelText="Hủy"
        gap="20px"
        gridColumns={3}
      />
    </BaseView>
  );
}

export default AddDestinationPage;
