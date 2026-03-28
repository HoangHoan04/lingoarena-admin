import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { TourDetailDto } from "@/dto/tour-detail.dto";
import { useTourSelectBox } from "@/hooks/tour";
import { useCreateTourDetail } from "@/hooks/tour-detail";
import { Dialog } from "primereact/dialog";
import { useMemo } from "react";

function AddTourDetailDialog({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới chi tiết tour",
  isLoadingUpdate = false,
  onCancel,
  isOpenDialogAdd,
}: {
  initData?: TourDetailDto;
  isEdit?: boolean;
  handleUpdate?: (data: TourDetailDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
  isOpenDialogAdd: boolean;
}) {
  const { isLoading, onCreateTourDetail } = useCreateTourDetail();
  const { data: tourOptions } = useTourSelectBox();

  type TourSubmitValues = Omit<TourDetailDto, "tags"> & {
    tags?: string | string[];
  };

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã chi tiết tour",
        type: "input",
        placeholder: "Mã chi tiết tour sẽ được tự động tạo",
        disabled: true,
        col: 4,
      },
      {
        name: "startDay",
        label: "Ngày khởi hành",
        type: "datepicker",
        required: true,
        placeholder: "Nhập ngày khởi hành (VD: 2024-12-31)",
        col: 4,
      },
      {
        name: "endDay",
        label: "Ngày kết thúc",
        type: "datepicker",
        required: true,
        placeholder: "Nhập ngày kết thúc (VD: 2024-12-31)",
        col: 4,
      },
      {
        name: "startLocation",
        label: "Địa điểm khởi hành",
        type: "input",
        required: true,
        placeholder: "Nhập địa điểm khởi hành (VD: Hà Nội)",
        col: 4,
      },
      {
        name: "capacity",
        label: "Sức chứa",
        type: "number",
        placeholder: "Nhập sức chứa của tour (VD: 20)",
        col: 4,
      },
      {
        name: "remainingSeats",
        label: "Số ghế còn lại",
        type: "number",
        placeholder: "Số ghế sẽ được khởi tạo bằng sức chứa ban đầu",
        disabled: true,
        col: 4,
      },
      {
        name: "tourId",
        label: "Mã tour",
        type: "select",
        required: true,
        placeholder: "Chọn mã tour",
        col: 12,
        options: tourOptions?.map((tour) => ({
          id: tour.id,
          name: tour.title,
          value: tour.id,
        })),
      },
    ];
  }, [tourOptions]);

  const handleSubmit = (values: TourSubmitValues) => {
    const submitData: TourDetailDto = values;

    if (isEdit && handleUpdate) {
      handleUpdate(submitData);
    } else {
      onCreateTourDetail(submitData);
    }
  };

  return (
    <Dialog
      header={title}
      visible={isOpenDialogAdd}
      style={{ width: "50vw" }}
      onHide={onCancel ?? (() => {})}
    >
      <FormCustom
        title={title}
        showDivider={true}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        submitText="Lưu"
        cancelText="Hủy"
        gap="20px"
        gridColumns={12}
      />
    </Dialog>
  );
}

export default AddTourDetailDialog;
