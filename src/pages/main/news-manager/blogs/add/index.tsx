import { enumData } from "@/common/enums/enum";
import BaseView from "@/components/ui/BaseView";
import FormCustom, { type FormField } from "@/components/ui/FormCustom";
import type { BlogDto } from "@/dto/blog.dto";
import { useCreateBlog } from "@/hooks/blog";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddBlogPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới bài viết blog",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: BlogDto;
  isEdit?: boolean;
  handleUpdate?: (data: BlogDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateBlog } = useCreateBlog();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "title",
        label: "Tiêu đề bài viết",
        type: "input",
        required: true,
        placeholder: "Nhập tiêu đề bài viết",
      },
      {
        name: "slug",
        label: "Đường dẫn (Slug)",
        type: "input",
        required: true,
        placeholder: "Nhập đường dẫn (slug)",
        disabled: isEdit,
      },
      {
        name: "excerpt",
        label: "Tóm tắt ngắn",
        type: "textarea",
        placeholder: "Nhập tóm tắt ngắn cho bài viết",
      },
      {
        name: "content",
        label: "Nội dung bài viết",
        type: "textarea",
        required: true,
        placeholder: "Nhập nội dung đầy đủ bài viết",
        gridColumn: "span 3",
      },
      {
        name: "category",
        label: "Danh mục",
        type: "input",
        placeholder: "Nhập danh mục bài viết",
      },
      {
        name: "tags",
        label: "Tags (phân cách bằng dấu phẩy)",
        type: "multiselect",
        placeholder: "VD: du lịch, tour, nghỉ dưỡng",
        options: [],
      },
      {
        name: "status",
        label: "Trạng thái xuất bản",
        type: "select",
        required: true,
        options: Object.values(enumData.BLOG_STATUS || {}).map((item: any) => ({
          id: item.code,
          name: item.name,
          value: item.code,
        })),
        placeholder: "Chọn trạng thái xuất bản",
      },
      {
        name: "seoTitle",
        label: "Tiêu đề SEO",
        type: "input",
        placeholder: "Nhập tiêu đề SEO",
      },
      {
        name: "seoDescription",
        label: "Mô tả SEO",
        type: "textarea",
        placeholder: "Nhập mô tả SEO",
      },
      {
        name: "publishedAt",
        label: "Ngày xuất bản",
        type: "datepicker",
        placeholder: "Chọn ngày xuất bản",
      },
      {
        name: "featuredImage",
        label: "Ảnh đại diện bài viết",
        type: "image",
        isSingle: true,
        required: false,
        gridColumn: "span 3",
      },
    ];
  }, [isEdit]);

  const handleSubmit = (values: any) => {
    const submitData = {
      ...values,
    };

    if (isEdit && handleUpdate) {
      handleUpdate(submitData);
    } else {
      onCreateBlog(submitData);
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

export default AddBlogPage;
