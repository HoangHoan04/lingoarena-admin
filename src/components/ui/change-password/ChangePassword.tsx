import { useToast } from "@/context/ToastContext";
import { authService } from "@/services";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import React, { useState } from "react";

interface Props {
  visible: boolean;
  onHide: () => void;
}

export const ChangePasswordModal: React.FC<Props> = ({ visible, onHide }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return showToast({
        type: "error",
        message: "Vui lòng nhập đầy đủ tất cả các trường mật khẩu",
        title: "Thông báo",
      });
    }
    if (newPassword.length < 6) {
      return showToast({
        type: "error",
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
        title: "Thông báo",
      });
    }
    if (newPassword !== confirmPassword) {
      return showToast({
        type: "error",
        message: "Mật khẩu xác nhận không khớp",
        title: "Lỗi",
      });
    }
    setLoading(true);
    try {
      await authService.changePassword(formData);
      showToast({
        type: "success",
        message: "Đổi mật khẩu thành công!",
        title: "Thành công",
      });
      onHide();
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      showToast({
        type: "error",
        message: error?.message || "Đổi mật khẩu thất bại",
        title: "Lỗi",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header="Đổi mật khẩu"
      visible={visible}
      onHide={onHide}
      style={{ width: "400px" }}
    >
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col ">
          <label>Mật khẩu hiện tại</label>
          <Password
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            toggleMask
            feedback={false}
            className="w-full!"
            inputClassName="w-full!"
            style={{
              width: "100%!",
              display: "block",
            }}
            pt={{
              root: { className: "w-full" },
              showIcon: { className: "top-1/2 -mt-2" },
              hideIcon: { className: "top-1/2 -mt-2" },
              input: { root: { className: "w-full" } },
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label>Mật khẩu mới</label>
          <Password
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            toggleMask
            className="w-full"
            inputClassName="w-full"
            style={{
              width: "100%!",
              display: "block",
            }}
            pt={{
              root: { className: "w-full" },
              showIcon: { className: "top-1/2 -mt-2" },
              hideIcon: { className: "top-1/2 -mt-2" },
              input: { root: { className: "w-full" } },
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label>Xác nhận mật khẩu mới</label>
          <Password
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            toggleMask
            feedback={false}
            className="w-full"
            inputClassName="w-full"
            style={{
              width: "100%!",
              display: "block",
              justifyContent: "center",
              alignContent: "center",
            }}
            pt={{
              root: { className: "w-full" },
              showIcon: { className: "top-1/2 -mt-2" },
              hideIcon: { className: "top-1/2 -mt-2" },
              input: { root: { className: "w-full" } },
            }}
          />
        </div>
        <Button
          label="Cập nhật"
          icon="pi pi-save"
          outlined
          className="p-button-success rounded-2xl"
          style={{
            height: 40,
            fontSize: 13,
            width: "50%",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          loading={loading}
          onClick={handleSubmit}
        />
      </div>
    </Dialog>
  );
};
