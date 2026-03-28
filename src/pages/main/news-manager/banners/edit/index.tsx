import GlobalLoading from "@/components/ui/Loading";
import { useBannerDetail, useUpdateBanner } from "@/hooks/banner";
import { useParams } from "react-router-dom";
import AddBannerPage from "../add";

function EditBannerPage() {
  const { id } = useParams();
  const { data, isLoading } = useBannerDetail(id);
  const { onUpdateBanner, isLoading: isLoadingUpdate } = useUpdateBanner();

  const handleUpdate = (values: any) => {
    onUpdateBanner({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddBannerPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa banner"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditBannerPage;
