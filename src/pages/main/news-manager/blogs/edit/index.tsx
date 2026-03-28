import GlobalLoading from "@/components/ui/Loading";
import { useBlogDetail, useUpdateBlog } from "@/hooks/blog";
import { useParams } from "react-router-dom";
import AddBlogPage from "../add";

function EditBlogPage() {
  const { id } = useParams();
  const { data, isLoading } = useBlogDetail(id);
  const { onUpdateBlog, isLoading: isLoadingUpdate } = useUpdateBlog();

  const handleUpdate = (values: any) => {
    onUpdateBlog({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddBlogPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa bài viết blog"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditBlogPage;
