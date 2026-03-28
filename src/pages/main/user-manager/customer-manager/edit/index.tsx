import GlobalLoading from "@/components/ui/Loading";
import { useCustomerDetail, useUpdateCustomer } from "@/hooks/customer";
import { useParams } from "react-router-dom";
import AddCustomerPage from "../add";

function EditCustomerPage() {
  const { id } = useParams();
  const { data, isLoading } = useCustomerDetail(id);
  const { onUpdateCustomer, isLoading: isLoadingUpdate } = useUpdateCustomer();

  const handleUpdate = (values: any) => {
    onUpdateCustomer({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddCustomerPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa khách hàng"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditCustomerPage;
