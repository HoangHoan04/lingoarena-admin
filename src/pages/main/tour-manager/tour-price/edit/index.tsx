import GlobalLoading from "@/components/ui/Loading";
import { useParams } from "react-router-dom";
import AddTourPricePage from "../add";
import { useUpdateTourPrice, useTourPrice } from "@/hooks/tour-price";

function EditTourPricePage() {
  const { id } = useParams();
  const { data, isLoading } = useTourPrice(id);
  const { onUpdateTourPrice, isLoading: isLoadingUpdate } =
    useUpdateTourPrice();

  const handleUpdate = (values: any) => {
    onUpdateTourPrice({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddTourPricePage
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

export default EditTourPricePage;
