import type { ImportResult } from "@/services/excel.service";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { useRef, useState } from "react";
import ExportLimitDialog from "./ExportExcelLimit";

interface ExcelImportExportProps {
  onDownloadTemplate?: () => void;
  onImportExcel?: (file: File) => Promise<void>;
  onExportExcel?: (limit?: number) => void;
  onDownloadErrorReport?: () => void;
  onClearResult?: () => void;
  isDownloadingTemplate?: boolean;
  isImporting?: boolean;
  isExporting?: boolean;
  importProgress?: number;
  importResult?: ImportResult<any> | null;
  showImport?: boolean;
  showExport?: boolean;
  showTemplate?: boolean;
  currentPageSize?: number;
  totalRecords?: number;
}

export default function ExcelImportExport({
  onDownloadTemplate,
  onImportExcel,
  onExportExcel,
  onDownloadErrorReport,
  onClearResult,
  isDownloadingTemplate = false,
  isImporting = false,
  isExporting = false,
  importProgress = 0,
  importResult = null,
  showImport = true,
  showExport = true,
  showTemplate = true,
  currentPageSize = 10,
  totalRecords = 0,
}: ExcelImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !onImportExcel) return;

    await onImportExcel(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  const handleExportConfirm = (limit?: number) => {
    if (onExportExcel) {
      onExportExcel(limit);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {showTemplate && onDownloadTemplate && (
          <Button
            label="Tải Template"
            icon={PrimeIcons.DOWNLOAD}
            severity="info"
            outlined
            onClick={onDownloadTemplate}
            disabled={isDownloadingTemplate}
            loading={isDownloadingTemplate}
            size="small"
            style={{ fontSize: 12 }}
          />
        )}

        {showImport && onImportExcel && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              label="Import Excel"
              icon={PrimeIcons.UPLOAD}
              severity="info"
              outlined
              onClick={handleFileSelect}
              disabled={isImporting}
              loading={isImporting}
              size="small"
              style={{ fontSize: 12 }}
            />
          </>
        )}

        {showExport && onExportExcel && (
          <Button
            label="Export Excel"
            icon={PrimeIcons.FILE_EXCEL}
            severity="success"
            outlined
            onClick={handleExportClick}
            disabled={isExporting}
            loading={isExporting}
            size="small"
            style={{ fontSize: 12 }}
          />
        )}
      </div>

      {isImporting && (
        <div
          className="fixed top-20 left-4 bg-white rounded-lg shadow-lg p-4 z-50"
          style={{ width: "300px" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <i className="pi pi-spin pi-spinner" />
            <span className="font-semibold">Đang import...</span>
          </div>
          <ProgressBar value={Math.round(importProgress)} />
          <div className="text-sm text-gray-500 mt-2">
            {Math.round(importProgress)}% hoàn thành
          </div>
        </div>
      )}

      {isExporting && (
        <div
          className="fixed top-20 left-4 bg-white rounded-lg shadow-lg p-4 z-50"
          style={{ width: "300px" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <i className="pi pi-spin pi-spinner" />
            <span className="font-semibold">Đang xuất Excel...</span>
          </div>
          <ProgressBar mode="indeterminate" />
        </div>
      )}

      <ExportLimitDialog
        visible={showExportDialog}
        onHide={() => setShowExportDialog(false)}
        onConfirm={handleExportConfirm}
        currentPageSize={currentPageSize}
        totalRecords={totalRecords}
      />

      <Dialog
        header="Kết quả Import"
        visible={!!importResult}
        style={{ width: "600px" }}
        onHide={() => onClearResult?.()}
        footer={
          <div className="flex justify-end gap-2 mt-3">
            {importResult &&
              importResult.errors.length > 0 &&
              onDownloadErrorReport && (
                <Button
                  label="Tải báo cáo lỗi"
                  icon={PrimeIcons.DOWNLOAD}
                  severity="warning"
                  outlined
                  onClick={onDownloadErrorReport}
                />
              )}
            <Button
              label="Đóng"
              icon={PrimeIcons.TIMES}
              onClick={onClearResult}
              severity="secondary"
            />
          </div>
        }
      >
        {importResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {importResult.totalRows}
                </div>
                <div className="text-sm text-gray-600">Tổng số dòng</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {importResult.successRows}
                </div>
                <div className="text-sm text-gray-600">Thành công</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">
                  {importResult.errorRows}
                </div>
                <div className="text-sm text-gray-600">Lỗi</div>
              </div>
            </div>

            {importResult.success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded flex items-start gap-2">
                <i className="pi pi-check-circle text-green-500 mt-1" />
                <div className="text-sm text-green-700">
                  Import thành công tất cả {importResult.successRows} bản ghi!
                </div>
              </div>
            )}

            {importResult.errors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-red-600">
                  Chi tiết lỗi (hiển thị tối đa 10 lỗi):
                </h4>
                <div className="max-h-60 overflow-y-auto border rounded p-3">
                  {importResult.errors.slice(0, 10).map((error, index) => (
                    <div
                      key={index}
                      className="text-sm mb-2 pb-2 border-b last:border-b-0"
                    >
                      <span className="font-semibold text-red-600">
                        Dòng {error.row}:
                      </span>{" "}
                      {error.field && (
                        <span className="text-blue-600">[{error.field}]</span>
                      )}{" "}
                      {error.message}
                    </div>
                  ))}
                  {importResult.errors.length > 10 && (
                    <div className="text-sm text-gray-500 italic mt-2">
                      ... và {importResult.errors.length - 10} lỗi khác. Tải báo
                      cáo lỗi để xem chi tiết.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
}
