import { useTheme } from "@/context/ThemeContext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";

interface ExportLimitDialogProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: (limit?: number) => void;
  currentPageSize: number;
  totalRecords: number;
}

export default function ExportLimitDialog({
  visible,
  onHide,
  onConfirm,
  currentPageSize,
  totalRecords,
}: ExportLimitDialogProps) {
  const [exportType, setExportType] = useState<"current" | "custom" | "all">(
    "current"
  );
  const [customLimit, setCustomLimit] = useState<number>(100);
  const { theme } = useTheme();

  const handleConfirm = () => {
    let limit: number | undefined;

    switch (exportType) {
      case "current":
        limit = currentPageSize;
        break;
      case "custom":
        limit = customLimit;
        break;
      case "all":
        limit = undefined;
        break;
    }

    onConfirm(limit);
    onHide();
  };

  const handleCancel = () => {
    setExportType("current");
    setCustomLimit(100);
    onHide();
  };

  const isDark = theme === "dark";

  return (
    <Dialog
      header="Xuất Excel"
      visible={visible}
      style={{ width: "500px" }}
      onHide={handleCancel}
      footer={
        <div className="flex justify-end gap-2 mt-3">
          <Button
            label="Hủy"
            icon="pi pi-times-circle"
            onClick={handleCancel}
            severity="danger"
            style={{
              height: "30px",
              fontSize: "13px",
              color: "white",
            }}
          />
          <Button
            label="Xuất"
            icon="pi pi-file-excel"
            onClick={handleConfirm}
            severity="success"
            outlined
            className="p-button-outlined"
            style={{
              height: "30px",
              fontSize: "13px",
            }}
          />
        </div>
      }
    >
      <div className="space-y-3">
        <p
          className={`text-sm mb-3 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Chọn số lượng bản ghi muốn xuất ra file Excel
        </p>

        <div className="space-y-2">
          <div
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
              isDark
                ? exportType === "current"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                : exportType === "current"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onClick={() => setExportType("current")}
          >
            <RadioButton
              inputId="current"
              name="exportType"
              value="current"
              onChange={(e) => setExportType(e.value)}
              checked={exportType === "current"}
            />
            <label htmlFor="current" className="cursor-pointer flex-1">
              <div
                className={`font-medium text-sm ${
                  isDark ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Trang hiện tại
              </div>
              <div
                className={`text-xs mt-0.5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Xuất {currentPageSize} bản ghi đang hiển thị
              </div>
            </label>
          </div>

          <div
            className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${
              isDark
                ? exportType === "custom"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                : exportType === "custom"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <RadioButton
              inputId="custom"
              name="exportType"
              value="custom"
              onChange={(e) => setExportType(e.value)}
              checked={exportType === "custom"}
              className="mt-0.5"
            />
            <label htmlFor="custom" className="cursor-pointer flex-1">
              <div
                className={`font-medium text-sm ${
                  isDark ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Tùy chỉnh
              </div>
              <div
                className={`text-xs mt-0.5 mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Nhập số lượng bản ghi muốn xuất
              </div>
              {exportType === "custom" && (
                <div className="mt-2">
                  <InputNumber
                    value={customLimit}
                    onValueChange={(e) => setCustomLimit(e.value || 100)}
                    min={1}
                    max={totalRecords}
                    placeholder="Nhập số lượng"
                    className="w-full export-limit-input"
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClassName="p-button-sm "
                    incrementButtonClassName="p-button-sm"
                    inputClassName="text-sm"
                    security="info"
                    pt={{
                      buttonGroup: {
                        className: "bg-white",
                      },
                    }}
                  />
                </div>
              )}
            </label>
          </div>

          <div
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
              isDark
                ? exportType === "all"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                : exportType === "all"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onClick={() => setExportType("all")}
          >
            <RadioButton
              inputId="all"
              name="exportType"
              value="all"
              onChange={(e) => setExportType(e.value)}
              checked={exportType === "all"}
            />
            <label htmlFor="all" className="cursor-pointer flex-1">
              <div
                className={`font-medium text-sm ${
                  isDark ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Tất cả
              </div>
              <div
                className={`text-xs mt-0.5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Xuất tất cả {totalRecords} bản ghi
              </div>
            </label>
          </div>
        </div>

        <div
          className={`mt-3 p-3 rounded-lg border ${
            isDark
              ? "bg-blue-500/10 border-blue-500/30"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-start gap-2">
            <i
              className={`pi pi-info-circle mt-0.5 text-sm ${
                isDark ? "text-blue-400" : "text-blue-500"
              }`}
            />
            <div
              className={`text-xs ${
                isDark ? "text-blue-300" : "text-blue-700"
              }`}
            >
              <strong>Lưu ý:</strong> Xuất số lượng lớn có thể mất nhiều thời
              gian. Khuyến nghị xuất tối đa 1000 bản ghi mỗi lần.
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        .export-limit-input .p-inputnumber {
          width: 100%;
        }

        .export-limit-input .p-inputnumber-input {
          height: 32px;
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
          text-align: center;
        }

        .export-limit-input .p-inputnumber-button {
          width: 32px;
          height: 32px;
        }

        .export-limit-input .p-inputnumber-button .p-button-icon {
          font-size: 0.75rem;
        }

        .export-limit-input .p-button-icon-only {
          padding: 0.375rem;
        }

        .export-limit-input .p-inputnumber-buttons-horizontal .p-button {
          flex: 0 0 32px;
        }
          .p-button-sm p-inputnumber-button p-inputnumber-button-up p-button p-button-icon-only p-component{
          background-color: red;
          
          }
        `}
      </style>
    </Dialog>
  );
}
