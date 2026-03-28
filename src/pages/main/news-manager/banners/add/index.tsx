import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { BannerDto } from "@/dto/banner.dto";
import { useCreateBanner } from "@/hooks/banner";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddBannerPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới banner",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: BannerDto;
  isEdit?: boolean;
  handleUpdate?: (data: BannerDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateBanner } = useCreateBanner();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "title",
        label: "Tiêu đề banner",
        type: "input",
        required: true,
        placeholder: "Nhập tiêu đề banner",
        maxLength: 255,
      },
      {
        name: "url",
        label: "Đường dẫn banner",
        type: "input",
        required: true,
        placeholder: "Nhập đường dẫn banner",
        disabled: isEdit,
      },
      {
        name: "displayOrder",
        label: "Thứ tự hiển thị",
        type: "input",
        required: true,
        placeholder: "Nhập thứ tự hiển thị",
      },
      {
        name: "type",
        label: "Loại banner",
        type: "select",
        options: Object.values(enumData.BANNER_TYPE || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        placeholder: "Chọn loại banner",
      },

      {
        name: "effectiveStartDate",
        label: "Ngày bắt đầu hiệu lực",
        type: "datepicker",
        placeholder: "Nhập ngày bắt đầu hiệu lực",
      },
      {
        name: "effectiveEndDate",
        label: "Ngày kết thúc hiệu lực",
        type: "datepicker",
        placeholder: "Nhập ngày kết thúc hiệu lực",
      },
      {
        name: "isVisible",
        label: "Hiển thị/Ẩn",
        type: "checkbox",
      },
      {
        name: "image",
        label: "Hình ảnh banner",
        type: "image",
        isSingle: true,
        required: false,
        gridColumn: "span 3",
      },
    ];
  }, [isEdit]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateBanner(values);
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

export default AddBannerPage;
