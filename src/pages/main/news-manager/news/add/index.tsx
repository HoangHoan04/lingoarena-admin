import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { NewDto } from "@/dto/new.dto";
import { useCreateNew } from "@/hooks/new";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddNewPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới new",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: NewDto;
  isEdit?: boolean;
  handleUpdate?: (data: NewDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateNew } = useCreateNew();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "url",
        label: "URL tin tức",
        type: "input",
        required: false,
        placeholder: "Nhập URL tin tức",
        disabled: isEdit,
      },
        {
        name: "title",
        label: "Tiêu đề tin tức ",
        type: "input",
        required: true,
        placeholder: "Nhập tiêu đề tin tức ",
        maxLength: 255,
      },
       {
        name: "content",
        label: "Nội dung tin tức ",
        type: "richtext",
        required: true,
        placeholder:
          "Nhập nội dung tin tức. Bạn có thể nhúng hình ảnh trực tiếp bằng cách nhấn vào nút hình ảnh trên thanh công cụ.",
      },
      {
        name: "type",
        label: "Loại tin tức",
        type: "select",
        options: Object.values(enumData.NEW_TYPE || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        placeholder: "Chọn loại tin tức",
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
        name: "rank",
        label: "Thứ tự tin tức",
        type: "number",
        required: false,
        placeholder: "Nhập thứ tự tin tức",
      },
      {
        name: "images",
        label: "Hình ảnh tin tức",
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
      onCreateNew(values);
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

export default AddNewPage;
