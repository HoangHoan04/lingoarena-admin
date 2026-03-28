import GlobalLoading from "@/components/ui/Loading";
import {
  useDestinationDetail,
  useUpdateDestination,
} from "@/hooks/destination";
import { useParams } from "react-router-dom";
import AddDestinationPage from "../add";

function EditDestinationPage() {
  const { id } = useParams();
  const { data, isLoading } = useDestinationDetail(id);
  const { onUpdateDestination, isLoading: isLoadingUpdate } =
    useUpdateDestination();

  const handleUpdate = (values: any) => {
    onUpdateDestination({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddDestinationPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa điểm đến"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditDestinationPage;
