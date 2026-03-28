import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { TravelHintDto } from "@/dto/travel-hint.dto";
import { useCreateTravelHint } from "@/hooks/travel-hint";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddTravelHintPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới địa điểm gợi ý du lịch",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: TravelHintDto;
  isEdit?: boolean;
  handleUpdate?: (data: TravelHintDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTravelHint } = useCreateTravelHint();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "month",
        label: "Tháng đề xuất",
        type: "select",
        placeholder: "Chọn tháng đề xuất",
        options: Object.values(enumData.MONTH || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        required: true,
      },
      {
        name: "locationName",
        label: "Tên địa điểm",
        type: "input",
        required: true,
        placeholder: "Nhập tên địa điểm",
        disabled: isEdit,
      },
      {
        name: "reason",
        label: "Lý do gợi ý",
        type: "input",
        required: true,
        placeholder: "Nhập lý do gợi ý",
      },
      {
        name: "type",
        label: "Loại gợi ý",
        type: "select",
        options: Object.values(enumData.TRAVEL_HINT_TYPE || {}).map(
          (item: any) => ({
            id: item.code,
            name: item.name,
            value: item.code,
          }),
        ),
        placeholder: "Chọn loại gợi ý",
      },
      {
        name: "tags",
        label: "Tags",
        type: "multiselect",
        placeholder: "Chọn tags",
        required: false,
        options: Object.values(enumData.TAG_TRAVEL_HINT || {}).map(
          (item: any) => ({
            id: item.code,
            name: item.name,
            value: item.code,
          }),
        ),
      },
      {
        name: "country",
        label: "Quốc gia",
        type: "input",
        placeholder: "Nhập quốc gia",
      },
      {
        name: "city",
        label: "Thành phố",
        type: "input",
        placeholder: "Nhập thành phố",
      },
      {
        name: "longitude",
        label: "Kinh độ",
        type: "input",
        placeholder: "Nhập kinh độ",
      },
      {
        name: "latitude",
        label: "Vĩ độ",
        type: "input",
        placeholder: "Nhập vĩ độ",
      },
      {
        name: "images",
        label: "Hình ảnh banner",
        type: "image",
        isSingle: false,
        required: false,
        gridColumn: "span 3",
      },
    ];
  }, [isEdit]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateTravelHint(values);
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

export default AddTravelHintPage;
