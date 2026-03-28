import GlobalLoading from "@/components/ui/Loading";
import { useTourGuideDetail, useUpdateTourGuide } from "@/hooks/tour-guide";
import { useParams } from "react-router-dom";
import AddTourGuidePage from "../add";

function EditTourGuidePage() {
  const { id } = useParams();
  const { data, isLoading } = useTourGuideDetail(id);
  const { onUpdateTourGuide, isLoading: isLoadingUpdate } =
    useUpdateTourGuide();

  const handleUpdate = (values: any) => {
    onUpdateTourGuide({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddTourGuidePage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa hướng dẫn viên"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditTourGuidePage;
