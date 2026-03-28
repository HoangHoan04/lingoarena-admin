import GlobalLoading from "@/components/ui/Loading";
import { useTourDetail, useUpdateTour } from "@/hooks/tour";
import { useParams } from "react-router-dom";
import AddTourPage from "../add";

function EditTourPage() {
  const { id } = useParams();
  const { data, isLoading } = useTourDetail(id);
  const { onUpdateTour, isLoading: isLoadingUpdate } = useUpdateTour();

  const handleUpdate = (values: any) => {
    onUpdateTour({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddTourPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa tour"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditTourPage;
