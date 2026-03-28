import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { forwardRef, useImperativeHandle, useState } from "react";

type ActionConfirmProps = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  withReason?: boolean;
  isRequireReason?: boolean;
  onConfirm: (reason?: string) => void | Promise<void>;
  children?: React.ReactNode;
};

export type ActionConfirmRef = {
  show: () => void;
  hide: () => void;
};

const ActionConfirm = forwardRef<ActionConfirmRef, ActionConfirmProps>(
  (
    {
      title,
      message,
      confirmText,
      cancelText,
      withReason = false,
      isRequireReason = false,
      onConfirm,
      children,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }));

    const handleOk = async () => {
      if (isRequireReason && !reason.trim()) return;

      setLoading(true);
      try {
        await onConfirm(reason);
        setReason("");
        setVisible(false);
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setReason("");
      setVisible(false);
    };

    const footer = (
      <div className="flex justify-end gap-2 mt-5">
        <Button
          label={cancelText || "Hủy"}
          icon="pi pi-times-circle"
          className="p-button-danger"
          onClick={handleCancel}
          style={{
            height: 30,
            fontSize: 13,
          }}
        />
        <Button
          label={confirmText || "Xác nhận"}
          onClick={handleOk}
          loading={loading}
          text
          disabled={isRequireReason && !reason.trim()}
          style={{
            height: 30,
            fontSize: 13,
          }}
        />
      </div>
    );

    return (
      <>
        {children && <span onClick={() => setVisible(true)}>{children}</span>}

        <Dialog
          header={title}
          visible={visible}
          style={{ width: "500px" }}
          footer={footer}
          onHide={handleCancel}
          pt={{
            footer: { className: "p-3" },
          }}
          blockScroll
        >
          <div>{message}</div>
          {withReason && (
            <InputTextarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Lý do"
              rows={3}
              className="w-full"
            />
          )}
        </Dialog>
      </>
    );
  },
);

ActionConfirm.displayName = "ActionConfirm";

export default ActionConfirm;
