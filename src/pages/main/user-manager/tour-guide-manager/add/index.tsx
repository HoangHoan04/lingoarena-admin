import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { TourGuideDto } from "@/dto/tour-guide.dto";
import { useCreateTourGuide } from "@/hooks/tour-guide";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddTourGuidePage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới hướng dẫn viên",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: TourGuideDto;
  isEdit?: boolean;
  handleUpdate?: (data: TourGuideDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTourGuide } = useCreateTourGuide();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã hướng dẫn viên",
        type: "input",
        placeholder: "Mã hướng dẫn viên tự động sinh khi lưu",
        disabled: true,
        col: 6,
      },
      {
        name: "slug",
        label: "Slug",
        type: "input",
        placeholder: "Slug tự động sinh khi lưu",
        disabled: true,
        col: 6,
      },
      {
        name: "name",
        label: "Tên hướng dẫn viên",
        type: "input",
        placeholder: "Nhập tên hướng dẫn viên",
        required: true,
        col: 6,
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "phoneNumber",
        required: true,
        placeholder: "Nhập số điện thoại",
        col: 6,
      },

      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Nhập email",
        col: 6,
      },
      {
        name: "address",
        label: "Địa chỉ",
        type: "input",
        placeholder: "Nhập địa chỉ",
        col: 6,
      },
      {
        name: "gender",
        label: "Giới tính",
        type: "select",
        placeholder: "Chọn giới tính",
        options: Object.values(enumData.GENDER || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        col: 6,
      },
      {
        name: "birthday",
        label: "Ngày sinh",
        type: "datepicker",
        placeholder: "Nhập ngày sinh",
        required: true,
        col: 6,
      },
      {
        name: "nationality",
        label: "Quốc tịch",
        type: "input",
        placeholder: "Nhập quốc tịch",
        col: 6,
      },
      {
        name: "identityCard",
        label: "Số CMND/CCCD",
        type: "input",
        placeholder: "Nhập số CMND/CCCD",
        col: 6,
      },
      {
        name: "passportNumber",
        label: "Số hộ chiếu",
        type: "input",
        placeholder: "Nhập số hộ chiếu",
        col: 6,
      },

      {
        name: "languages",
        label: "Ngôn ngữ",
        type: "multiselect",
        placeholder: "Chọn ngôn ngữ",
        options: Object.values(enumData.LANGUAGES || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        col: 6,
      },
      {
        name: "specialties",
        label: "Chuyên môn",
        type: "multiselect",
        placeholder: "Nhập chuyên môn",
        options: Object.values(enumData.SPECIALTIES || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        col: 6,
      },
      {
        name: "yearsOfExperience",
        label: "Số năm kinh nghiệm",
        type: "number",
        placeholder: "Nhập số năm kinh nghiệm",
        col: 6,
      },
      {
        name: "licenseNumber",
        label: "Số giấy phép",
        type: "input",
        placeholder: "Nhập số giấy phép",
        col: 6,
      },
      {
        name: "licenseIssuedDate",
        label: "Ngày cấp giấy phép",
        type: "datepicker",
        placeholder: "Nhập ngày cấp giấy phép",
        col: 6,
      },
      {
        name: "licenseExpiryDate",
        label: "Ngày hết hạn giấy phép",
        type: "datepicker",
        placeholder: "Nhập ngày hết hạn giấy phép",
        col: 6,
      },
      {
        name: "licenseIssuedBy",
        label: "Nơi cấp giấy phép",
        type: "input",
        placeholder: "Nhập nơi cấp giấy phép",
        col: 6,
      },

      {
        name: "baseSalary",
        label: "Lương cơ bản",
        type: "number",
        placeholder: "Nhập lương cơ bản",
        col: 6,
      },
      {
        name: "commissionRate",
        label: "Tỷ lệ hoa hồng (%)",
        type: "number",
        placeholder: "Nhập tỷ lệ hoa hồng",
        col: 6,
      },
      {
        name: "startDate",
        label: "Ngày bắt đầu",
        type: "datepicker",
        placeholder: "Nhập ngày bắt đầu",
        col: 6,
      },
      {
        name: "endDate",
        label: "Ngày kết thúc",
        type: "datepicker",
        placeholder: "Nhập ngày kết thúc",
        col: 6,
      },
      {
        name: "isAvailable",
        label: "Có sẵn",
        type: "checkbox",
        placeholder: "Chọn trạng thái có sẵn",
        col: 6,
      },

      {
        name: "bankName",
        label: "Tên ngân hàng",
        type: "input",
        placeholder: "Nhập tên ngân hàng",
        col: 6,
      },
      {
        name: "bankAccountNumber",
        label: "Số tài khoản ngân hàng",
        type: "input",
        placeholder: "Nhập số tài khoản ngân hàng",
        col: 6,
      },
      {
        name: "bankAccountName",
        label: "Tên chủ tài khoản ngân hàng",
        type: "input",
        placeholder: "Nhập tên chủ tài khoản ngân hàng",
        col: 6,
      },
      {
        name: "shortBio",
        label: "Tiểu sử ngắn",
        type: "textarea",
        placeholder: "Nhập tiểu sử ngắn",
        col: 6,
      },
      {
        name: "description",
        label: "Mô tả",
        type: "input",
        placeholder: "Nhập mô tả",
        col: 6,
      },
      {
        name: "bio",
        label: "Tiểu sử",
        type: "textarea",
        placeholder: "Nhập tiểu sử",
        col: 24,
      },

      {
        name: "avatar",
        label: "Ảnh đại diện",
        type: "image",
        isSingle: true,
        required: false,
        gridColumn: "span 5",
      },
    ];
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateTourGuide(values);
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
        gridColumns={24}
      />
    </BaseView>
  );
}

export default AddTourGuidePage;
