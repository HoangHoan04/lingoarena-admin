import BaseView from "@/components/ui/BaseView";
import EmployeeAssignmentPage from "./employee-assign";
import RoleAssignmentPage from "./role-assign";

export default function PermissionAssignmentPage() {
  const tabs = [
    {
      key: "role-assign",
      title: "Phân quyền theo Vai trò",
      content: <RoleAssignmentPage />,
    },
    {
      key: "employee-assign",
      title: "Gán vai trò cho Nhân viên",
      content: <EmployeeAssignmentPage />,
    },
  ];

  return <BaseView tabs={tabs} />;
}
