import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { CustomerDto } from "@/dto/customer.dto";
import { useCreateCustomer } from "@/hooks/customer";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddCustomerPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới khách hàng",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: CustomerDto;
  isEdit?: boolean;
  handleUpdate?: (data: CustomerDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateCustomer } = useCreateCustomer();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã khách hàng",
        type: "input",
        placeholder: "Mã khách hàng tự động sinh khi lưu",
        disabled: true,
      },
      {
        name: "name",
        label: "Tên khách hàng",
        type: "input",
        placeholder: "Nhập tên khách hàng",
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "phoneNumber",
        required: true,
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Nhập email",
      },

      {
        name: "address",
        label: "Địa chỉ",
        type: "input",
        placeholder: "Nhập địa chỉ",
      },
      {
        name: "birthday",
        label: "Ngày sinh",
        type: "datepicker",
        placeholder: "Nhập ngày sinh",
      },
      {
        name: "nationality",
        label: "Quốc tịch",
        type: "input",
        placeholder: "Nhập quốc tịch",
      },
      {
        name: "identityCard",
        label: "Số CMND/CCCD",
        type: "input",
        placeholder: "Nhập số CMND/CCCD",
      },
      {
        name: "passportNumber",
        label: "Số hộ chiếu",
        type: "input",
        placeholder: "Nhập số hộ chiếu",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        placeholder: "Nhập mô tả",
      },
      {
        name: "avatar",
        label: "Ảnh đại diện",
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
      onCreateCustomer(values);
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

export default AddCustomerPage;
