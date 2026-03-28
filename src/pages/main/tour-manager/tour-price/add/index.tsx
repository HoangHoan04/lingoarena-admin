import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { TourPriceDto } from "@/dto/tour-price.dto";
import { useCreateTourPrice } from "@/hooks/tour-price";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddTourPricePage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới giá tour",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: TourPriceDto;
  isEdit?: boolean;
  handleUpdate?: (data: TourPriceDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTourPrice } = useCreateTourPrice();
  const router = useRouter();

  type TourSubmitValues = Omit<TourPriceDto, "tags"> & {
    tags?: string | string[];
  };

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã tour",
        type: "input",
        placeholder: "Mã tour sẽ được tự động tạo",
        disabled: true,
        col: 4,
      },
      {
        name: "title",
        label: "Tiêu đề tour",
        type: "input",
        required: true,
        placeholder: "Nhập tiêu đề tour",
        col: 4,
      },
      {
        name: "location",
        label: "Địa điểm",
        type: "input",
        required: true,
        placeholder: "Nhập địa điểm tour (VD: Hà Nội - Hạ Long)",
        col: 4,
      },
      {
        name: "durations",
        label: "Thời gian",
        type: "input",
        required: true,
        placeholder: "Nhập thời gian tour (VD: 3 ngày 2 đêm)",
        col: 4,
      },
      {
        name: "category",
        label: "Danh mục",
        type: "input",
        placeholder: "Nhập danh mục tour (VD: Du lịch biển, Du lịch văn hóa)",
        col: 4,
      },
      {
        name: "tags",
        label: "Tags",
        type: "input",
        placeholder:
          "Nhập tags, phân cách bằng dấu phẩy (VD: biển, núi, văn hóa)",
        col: 4,
      },
      {
        name: "shortDescription",
        label: "Mô tả ngắn",
        type: "textarea",
        required: true,
        placeholder: "Nhập mô tả ngắn gọn về tour",
        col: 12,
      },
      {
        name: "longDescription",
        label: "Mô tả chi tiết",
        type: "textarea",
        placeholder: "Nhập mô tả chi tiết về tour",
        col: 12,
      },
      {
        name: "highlights",
        label: "Điểm nổi bật",
        type: "textarea",
        placeholder: "Nhập các điểm nổi bật của tour",
        col: 12,
      },
      {
        name: "included",
        label: "Dịch vụ bao gồm",
        type: "textarea",
        placeholder: "Nhập các dịch vụ đã bao gồm trong tour",
        col: 6,
      },
      {
        name: "excluded",
        label: "Dịch vụ không bao gồm",
        type: "textarea",
        placeholder: "Nhập các dịch vụ không bao gồm trong tour",
        col: 6,
      },
    ];
  }, []);

  const handleSubmit = (values: TourSubmitValues) => {
    const submitData: TourPriceDto = values;

    if (isEdit && handleUpdate) {
      handleUpdate(submitData);
    } else {
      onCreateTourPrice(submitData);
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
        gridColumns={12}
      />
    </BaseView>
  );
}

export default AddTourPricePage;
