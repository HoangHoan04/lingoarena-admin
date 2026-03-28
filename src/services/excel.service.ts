import * as XLSX from "xlsx";

// ============================================================
// INTERFACES
// ============================================================

export interface ExcelColumn {
  field: string;
  header: string;
  width?: number;
  required?: boolean;
  formatter?: (value: any) => any;
}

export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  totalRows: number;
  successRows: number;
  errorRows: number;
}

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  columns?: ExcelColumn[];
  headerStyle?: {
    backgroundColor?: string; // hex e.g. "4472C4"
    fontColor?: string;        // hex e.g. "FFFFFF"
    bold?: boolean;
    fontSize?: number;
  };
  title?: string;
}

export interface ImportOptions<T> {
  columns: ExcelColumn[];
  validator?: (data: T) => { valid: boolean; errors: string[] };
  transformer?: (data: any) => T;
  onProgress?: (progress: number) => void;
}

export interface TemplateOptions {
  filename?: string;
  sheetName?: string;
  sampleData?: any[];
  headerStyle?: {
    backgroundColor?: string;
    fontColor?: string;
    bold?: boolean;
  };
  notes?: string;
}

// ============================================================
// EXCEL SERVICE
// ============================================================

class ExcelService {
  // ----------------------------------------------------------
  // EXPORT
  // ----------------------------------------------------------

  /**
   * Xuất danh sách dữ liệu ra file Excel (.xlsx)
   */
  async exportToExcel<T>(data: T[], options: ExportOptions = {}): Promise<void> {
    const {
      filename = `export_${new Date().getTime()}.xlsx`,
      sheetName = "Sheet1",
      columns,
      headerStyle = {
        backgroundColor: "4472C4",
        fontColor: "FFFFFF",
        bold: true,
        fontSize: 11,
      },
      title,
    } = options;

    try {
      let exportData: any[] = [];

      if (columns) {
        exportData = data.map((item: any) => {
          const row: any = {};
          columns.forEach((col) => {
            const value = this.getNestedValue(item, col.field);
            row[col.header] = col.formatter ? col.formatter(value) : (value ?? "");
          });
          return row;
        });
      } else {
        exportData = data as any[];
      }

      const workbook = XLSX.utils.book_new();
      let startRow = 0;

      // Tạo worksheet
      const worksheet: XLSX.WorkSheet = {};

      // Thêm tiêu đề nếu có
      if (title) {
        worksheet["A1"] = {
          v: title,
          t: "s",
          s: {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: "center" },
          },
        };
        const colCount = columns ? columns.length : Object.keys(exportData[0] || {}).length;
        worksheet["!merges"] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
        ];
        startRow = 1;
      }

      // Ghi dữ liệu vào worksheet
      const dataSheet = XLSX.utils.json_to_sheet(exportData);

      // Style header
      if (columns) {
        const colWidths = columns.map((col) => ({ wch: col.width || 18 }));
        dataSheet["!cols"] = colWidths;

        // Apply header style
        const range = XLSX.utils.decode_range(dataSheet["!ref"] || "A1");
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const addr = XLSX.utils.encode_col(C) + "1";
          if (!dataSheet[addr]) continue;
          dataSheet[addr].s = {
            fill: { fgColor: { rgb: headerStyle.backgroundColor || "4472C4" } },
            font: {
              bold: headerStyle.bold ?? true,
              color: { rgb: headerStyle.fontColor || "FFFFFF" },
              sz: headerStyle.fontSize || 11,
            },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }

        // Apply data cell border
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C });
            if (!dataSheet[addr]) {
              dataSheet[addr] = { v: "", t: "s" };
            }
            dataSheet[addr].s = {
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              },
              alignment: { vertical: "center", wrapText: true },
            };
          }
        }
      }

      // Merge nếu có title
      if (title && startRow > 0) {
        const existingMerges = dataSheet["!merges"] || [];
        dataSheet["!merges"] = existingMerges;
      }

      XLSX.utils.book_append_sheet(workbook, dataSheet, sheetName);
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("[ExcelService] exportToExcel error:", error);
      throw new Error("Có lỗi xảy ra khi xuất file Excel");
    }
  }

  // ----------------------------------------------------------
  // IMPORT
  // ----------------------------------------------------------

  /**
   * Đọc và import dữ liệu từ file Excel
   */
  async importFromExcel<T>(
    file: File,
    options: ImportOptions<T>
  ): Promise<ImportResult<T>> {
    const { columns, validator, transformer, onProgress } = options;

    // Validate file trước
    const validation = this.validateExcelFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
            raw: false,
          });

          const result: ImportResult<T> = {
            success: true,
            data: [],
            errors: [],
            totalRows: rawData.length,
            successRows: 0,
            errorRows: 0,
          };

          rawData.forEach((row, index) => {
            if (onProgress) {
              onProgress(((index + 1) / rawData.length) * 100);
            }

            try {
              const mappedData: any = {};
              const rowErrors: string[] = [];

              columns.forEach((col) => {
                // Hỗ trợ cả header có dấu * (required) hoặc không
                const headerKey =
                  row[col.header] !== undefined
                    ? col.header
                    : row[`${col.header} *`] !== undefined
                      ? `${col.header} *`
                      : col.header;

                const value = row[headerKey];

                if (
                  col.required &&
                  (value === undefined || value === null || value === "")
                ) {
                  rowErrors.push(`Trường "${col.header}" là bắt buộc`);
                }

                mappedData[col.field] = col.formatter ? col.formatter(value) : value;
              });

              if (rowErrors.length > 0) {
                rowErrors.forEach((error) => {
                  result.errors.push({ row: index + 2, field: "", message: error });
                });
                result.errorRows++;
                return;
              }

              const transformedData = transformer ? transformer(mappedData) : (mappedData as T);

              if (validator) {
                const vResult = validator(transformedData);
                if (!vResult.valid) {
                  vResult.errors.forEach((error) => {
                    result.errors.push({ row: index + 2, field: "", message: error });
                  });
                  result.errorRows++;
                  return;
                }
              }

              result.data.push(transformedData);
              result.successRows++;
            } catch (err: any) {
              result.errors.push({
                row: index + 2,
                field: "",
                message: err.message || "Lỗi không xác định",
              });
              result.errorRows++;
            }
          });

          result.success = result.errorRows === 0;
          resolve(result);
        } catch {
          reject(new Error("Có lỗi xảy ra khi đọc file Excel"));
        }
      };

      reader.onerror = () => reject(new Error("Có lỗi xảy ra khi đọc file"));
      reader.readAsArrayBuffer(file);
    });
  }

  // ----------------------------------------------------------
  // DOWNLOAD TEMPLATE
  // ----------------------------------------------------------

  /**
   * Tải file mẫu Excel để người dùng điền dữ liệu
   */
  async downloadTemplate(
    columns: ExcelColumn[],
    filename: string = "template.xlsx",
    options: TemplateOptions = {}
  ): Promise<void> {
    const {
      sheetName = "Template",
      sampleData,
      headerStyle = {
        backgroundColor: "1F4E79",
        fontColor: "FFFFFF",
        bold: true,
      },
      notes,
    } = options;

    try {
      const workbook = XLSX.utils.book_new();
      const worksheet: XLSX.WorkSheet = {};

      // Tạo hàng header: Thêm dấu * cho required fields
      const headers = columns.map((col) =>
        col.required ? `${col.header} *` : col.header
      );

      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

      // Thêm dữ liệu mẫu nếu có
      if (sampleData && sampleData.length > 0) {
        const rows = sampleData.map((item: any) =>
          columns.map((col) => {
            const value = this.getNestedValue(item, col.field);
            return col.formatter ? col.formatter(value) : (value ?? "");
          })
        );
        XLSX.utils.sheet_add_aoa(worksheet, rows, { origin: "A2" });
      }

      // Độ rộng cột
      worksheet["!cols"] = columns.map((col) => ({ wch: col.width || 22 }));

      // Style cho header
      const colCount = columns.length;
      for (let C = 0; C < colCount; C++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[addr]) continue;

        const isRequired = columns[C]?.required;
        worksheet[addr].s = {
          fill: { fgColor: { rgb: headerStyle.backgroundColor || "1F4E79" } },
          font: {
            bold: headerStyle.bold ?? true,
            color: { rgb: isRequired ? "FFD700" : (headerStyle.fontColor || "FFFFFF") },
            sz: 11,
          },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: {
            top: { style: "medium" },
            bottom: { style: "medium" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }

      // Đặt chiều cao hàng header
      worksheet["!rows"] = [{ hpt: 25 }];

      // Thêm sheet ghi chú nếu có
      if (notes) {
        const noteSheet: XLSX.WorkSheet = {};
        XLSX.utils.sheet_add_aoa(noteSheet, [["Ghi chú"], [notes]], {
          origin: "A1",
        });
        noteSheet["A1"].s = { font: { bold: true, sz: 12 } };
        noteSheet["!cols"] = [{ wch: 80 }];
        XLSX.utils.book_append_sheet(workbook, noteSheet, "Ghi chú");
      }

      // Sheet thông tin cột required
      const infoData = [
        ["Ký hiệu", "Ý nghĩa"],
        ["* (dấu sao)", "Trường bắt buộc, không được để trống"],
        ["Không có *", "Trường không bắt buộc, có thể để trống"],
      ];
      const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
      infoSheet["!cols"] = [{ wch: 20 }, { wch: 50 }];
      XLSX.utils.book_append_sheet(workbook, infoSheet, "Hướng dẫn");

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("[ExcelService] downloadTemplate error:", error);
      throw new Error("Có lỗi xảy ra khi tải template");
    }
  }

  // ----------------------------------------------------------
  // VALIDATE FILE
  // ----------------------------------------------------------

  /**
   * Kiểm tra định dạng và kích thước file Excel
   */
  validateExcelFile(file: File): { valid: boolean; error?: string } {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      return {
        valid: false,
        error: "File không đúng định dạng. Vui lòng chọn file Excel (.xlsx, .xls)",
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File quá lớn. Kích thước tối đa là 10MB",
      };
    }

    return { valid: true };
  }

  // ----------------------------------------------------------
  // OPEN FILE DIALOG (trigger input file từ code)
  // ----------------------------------------------------------

  /**
   * Mở hộp thoại chọn file Excel, trả về File được chọn
   */
  openFileDialog(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".xlsx,.xls";
      input.style.display = "none";

      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0] ?? null;
        resolve(file);
        document.body.removeChild(input);
      };

      input.oncancel = () => {
        resolve(null);
        document.body.removeChild(input);
      };

      document.body.appendChild(input);
      input.click();
    });
  }

  // ----------------------------------------------------------
  // PRIVATE HELPERS
  // ----------------------------------------------------------

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }
}

export const excelService = new ExcelService();
