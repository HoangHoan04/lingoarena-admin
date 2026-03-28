import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { TourDto } from "@/dto/tour.dto";
import { useCreateTour } from "@/hooks/tour";
import { useTourDetailSelectBox } from "@/hooks/tour-detail";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddTourPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới tour",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: TourDto;
  isEdit?: boolean;
  handleUpdate?: (data: TourDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTour } = useCreateTour();
  const { data: tourDetails, isLoading: isLoadingTourDetails } =
    useTourDetailSelectBox();
  const router = useRouter();

  type TourSubmitValues = Omit<TourDto, "tags"> & {
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
        name: "slug",
        label: "Slug",
        type: "input",
        placeholder: "Slug sẽ được tự động tạo",
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
      {
        name: "tourDetails",
        label: "Chi tiết tour",
        type: "multiselect",
        options:
          tourDetails?.map((item: any) => ({
            id: String(item.code),
            name: item.name,
            value: item.code,
          })) || [],
        loading: isLoadingTourDetails,
        placeholder: "Nhập các dịch vụ không bao gồm trong tour",
        col: 6,
      },
    ];
  }, [isLoadingTourDetails, tourDetails]);

  const handleSubmit = (values: TourSubmitValues) => {
    const parsedTags = Array.isArray(values?.tags)
      ? values.tags
      : typeof values?.tags === "string"
        ? values.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : [];

    const submitData: TourDto = {
      ...values,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
    };

    if (isEdit && handleUpdate) {
      handleUpdate(submitData);
    } else {
      onCreateTour(submitData);
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

export default AddTourPage;
