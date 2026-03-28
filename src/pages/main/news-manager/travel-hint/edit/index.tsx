import GlobalLoading from "@/components/ui/Loading";
import { useTravelHintDetail, useUpdateTravelHint } from "@/hooks/travel-hint";
import { useParams } from "react-router-dom";
import AddTravelHintPage from "../add";

function EditTravelHintPage() {
  const { id } = useParams();
  const { data, isLoading } = useTravelHintDetail(id);
  const { onUpdateTravelHint, isLoading: isLoadingUpdate } =
    useUpdateTravelHint();

  const handleUpdate = (values: any) => {
    onUpdateTravelHint({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddTravelHintPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa địa điểm gợi ý du lịch"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditTravelHintPage;
