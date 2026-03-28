import GlobalLoading from "@/components/ui/Loading";
import { useNewDetail, useUpdateNew } from "@/hooks/new";
import { useParams } from "react-router-dom";
import AddNewPage from "../add";

function EditNewPage() {
  const { id } = useParams();
  const { data, isLoading } = useNewDetail(id);
  const { onUpdateNew, isLoading: isLoadingUpdate } = useUpdateNew();

  const handleUpdate = (values: any) => {
    onUpdateNew({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddNewPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa tin tức"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditNewPage;
