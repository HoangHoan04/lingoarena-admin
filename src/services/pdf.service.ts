import jsPDF from "jspdf";
import autoTable, { type RowInput, type Styles } from "jspdf-autotable";

// ============================================================
// INTERFACES
// ============================================================

export interface PdfColumn {
  field: string;
  header: string;
  width?: number;
  align?: "left" | "center" | "right";
  formatter?: (value: any) => string;
}

export interface PdfOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  orientation?: "portrait" | "landscape";
  pageSize?: "a4" | "a3" | "letter";
  fontSize?: number;
  headerColor?: [number, number, number]; // RGB
  alternateRowColor?: [number, number, number]; // RGB
  showPageNumber?: boolean;
  showDate?: boolean;
  logo?: string; // base64 image
  author?: string;
  footerText?: string;
}

export interface PdfExportResult {
  success: boolean;
  filename: string;
  pagesCount: number;
}

// ============================================================
// PDF SERVICE
// ============================================================

class PdfService {
  private readonly DEFAULT_FONT_SIZE = 10;
  private readonly DEFAULT_HEADER_COLOR: [number, number, number] = [31, 78, 121]; // #1F4E79
  private readonly DEFAULT_ALT_ROW_COLOR: [number, number, number] = [235, 243, 255];

  // ----------------------------------------------------------
  // EXPORT TABLE DATA TO PDF
  // ----------------------------------------------------------

  /**
   * Xuất danh sách dữ liệu dạng bảng ra file PDF
   */
  async exportTableToPdf<T>(
    data: T[],
    columns: PdfColumn[],
    options: PdfOptions = {}
  ): Promise<PdfExportResult> {
    const {
      filename = `export_${Date.now()}.pdf`,
      title,
      subtitle,
      orientation = "landscape",
      pageSize = "a4",
      fontSize = this.DEFAULT_FONT_SIZE,
      headerColor = this.DEFAULT_HEADER_COLOR,
      alternateRowColor = this.DEFAULT_ALT_ROW_COLOR,
      showPageNumber = true,
      showDate = true,
      footerText,
      author = "BookingTour Admin",
    } = options;

    try {
      const doc = new jsPDF({ orientation, format: pageSize });

      // ------ META ------
      doc.setProperties({
        title: title || filename,
        author,
        creator: "BookingTour Admin System",
        subject: subtitle || "",
      });

      // ------ HEADER AREA ------
      const pageWidth = doc.internal.pageSize.getWidth();
      let currentY = 15;

      if (title) {
        doc.setFontSize(16);
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(title, pageWidth / 2, currentY, { align: "center" });
        currentY += 8;
      }

      if (subtitle) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(subtitle, pageWidth / 2, currentY, { align: "center" });
        currentY += 6;
      }

      if (showDate) {
        const dateStr = `Ngày xuất: ${new Date().toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`;
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(dateStr, pageWidth - 15, currentY, { align: "right" });
        currentY += 4;
      }

      // Đường kẻ phân cách
      if (title || subtitle || showDate) {
        doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.setLineWidth(0.5);
        doc.line(15, currentY, pageWidth - 15, currentY);
        currentY += 5;
      }

      // ------ TABLE ------
      const tableHeaders = columns.map((col) => ({
        content: col.header,
        styles: {
          halign: col.align || "left",
          fontStyle: "bold",
        } as Partial<Styles>,
      }));

      const tableRows: RowInput[] = data.map((item: any) =>
        columns.map((col) => {
          const value = this.getNestedValue(item, col.field);
          const displayValue = col.formatter
            ? col.formatter(value)
            : this.formatCellValue(value);
          return {
            content: displayValue,
            styles: { halign: col.align || "left" } as Partial<Styles>,
          };
        })
      );

      // Tính độ rộng cột
      const tableWidth = pageWidth - 30;
      const totalWeight = columns.reduce((sum, col) => sum + (col.width || 1), 0);
      const columnStyles: Record<number, Partial<Styles>> = {};
      columns.forEach((col, idx) => {
        const colWidth = ((col.width || 1) / totalWeight) * tableWidth;
        columnStyles[idx] = { cellWidth: colWidth };
      });

      autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        startY: currentY,
        margin: { left: 15, right: 15 },
        styles: {
          fontSize,
          cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
          overflow: "linebreak",
          lineColor: [210, 210, 210],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: headerColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
          minCellHeight: 10,
          fontSize: fontSize,
        },
        alternateRowStyles: {
          fillColor: alternateRowColor,
        },
        columnStyles,
        didDrawPage: (hookData) => {
          // Footer mỗi trang
          const pageH = doc.internal.pageSize.getHeight();
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);

          if (footerText) {
            doc.text(footerText, 15, pageH - 8);
          }

          if (showPageNumber) {
            const pageInfo = `Trang ${hookData.pageNumber}`;
            doc.text(pageInfo, pageWidth - 15, pageH - 8, { align: "right" });
          }
        },
      });

      doc.save(filename);

      const pagesCount = (doc as any).internal.getNumberOfPages?.() ?? 1;
      return { success: true, filename, pagesCount };
    } catch (error) {
      console.error("[PdfService] exportTableToPdf error:", error);
      throw new Error("Có lỗi xảy ra khi xuất file PDF");
    }
  }

  // ----------------------------------------------------------
  // EXPORT HTML ELEMENT TO PDF
  // ----------------------------------------------------------

  /**
   * Chuyển đổi nội dung HTML element sang PDF và tải xuống
   */
  async exportHtmlToPdf(
    elementId: string,
    options: PdfOptions = {}
  ): Promise<PdfExportResult> {
    const {
      filename = `export_${Date.now()}.pdf`,
      title,
      orientation = "portrait",
      pageSize = "a4",
    } = options;

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Không tìm thấy element với id="${elementId}"`);
      }

      const doc = new jsPDF({ orientation, format: pageSize });
      const pageWidth = doc.internal.pageSize.getWidth();
      let currentY = 15;

      if (title) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, pageWidth / 2, currentY, { align: "center" });
        currentY += 10;
      }

      // Parse các bảng HTML bên trong element
      const tables = element.querySelectorAll("table");
      if (tables.length > 0) {
        tables.forEach((table, index) => {
          if (index > 0) {
            doc.addPage();
            currentY = 15;
          }
          autoTable(doc, {
            html: table as HTMLTableElement,
            startY: currentY,
            margin: { left: 15, right: 15 },
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: {
              fillColor: this.DEFAULT_HEADER_COLOR,
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: this.DEFAULT_ALT_ROW_COLOR,
            },
          });
        });
      } else {
        // Nếu không có bảng, lấy text content
        const text = element.innerText || element.textContent || "";
        const lines = doc.splitTextToSize(text, pageWidth - 30);
        doc.setFontSize(10);
        doc.text(lines, 15, currentY);
      }

      doc.save(filename);
      const pagesCount = (doc as any).internal.getNumberOfPages?.() ?? 1;
      return { success: true, filename, pagesCount };
    } catch (error) {
      console.error("[PdfService] exportHtmlToPdf error:", error);
      throw new Error("Có lỗi xảy ra khi xuất HTML sang PDF");
    }
  }

  // ----------------------------------------------------------
  // PREVIEW PDF (hiển thị trong tab mới)
  // ----------------------------------------------------------

  /**
   * Xem trước PDF trong tab mới thay vì tải xuống
   */
  async previewTablePdf<T>(
    data: T[],
    columns: PdfColumn[],
    options: PdfOptions = {}
  ): Promise<void> {
    const {
      title,
      subtitle,
      orientation = "landscape",
      pageSize = "a4",
      fontSize = this.DEFAULT_FONT_SIZE,
      headerColor = this.DEFAULT_HEADER_COLOR,
      alternateRowColor = this.DEFAULT_ALT_ROW_COLOR,
      showPageNumber = true,
      showDate = true,
      footerText,
    } = options;

    try {
      const doc = new jsPDF({ orientation, format: pageSize });
      const pageWidth = doc.internal.pageSize.getWidth();
      let currentY = 15;

      if (title) {
        doc.setFontSize(16);
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(title, pageWidth / 2, currentY, { align: "center" });
        currentY += 8;
      }

      if (subtitle) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(subtitle, pageWidth / 2, currentY, { align: "center" });
        currentY += 6;
      }

      if (showDate) {
        const dateStr = `Ngày xem: ${new Date().toLocaleDateString("vi-VN")}`;
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(dateStr, pageWidth - 15, currentY, { align: "right" });
        currentY += 4;
      }

      if (title || subtitle || showDate) {
        doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.setLineWidth(0.5);
        doc.line(15, currentY, pageWidth - 15, currentY);
        currentY += 5;
      }

      const tableHeaders = columns.map((col) => ({
        content: col.header,
        styles: { halign: col.align || "left", fontStyle: "bold" } as Partial<Styles>,
      }));

      const tableRows: RowInput[] = data.map((item: any) =>
        columns.map((col) => {
          const value = this.getNestedValue(item, col.field);
          return col.formatter ? col.formatter(value) : this.formatCellValue(value);
        })
      );

      const tableWidth = pageWidth - 30;
      const totalWeight = columns.reduce((sum, col) => sum + (col.width || 1), 0);
      const columnStyles: Record<number, Partial<Styles>> = {};
      columns.forEach((col, idx) => {
        columnStyles[idx] = {
          cellWidth: ((col.width || 1) / totalWeight) * tableWidth,
        };
      });

      autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        startY: currentY,
        margin: { left: 15, right: 15 },
        styles: {
          fontSize,
          cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
          overflow: "linebreak",
          lineColor: [210, 210, 210],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: headerColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
          minCellHeight: 10,
        },
        alternateRowStyles: { fillColor: alternateRowColor },
        columnStyles,
        didDrawPage: (hookData) => {
          const pageH = doc.internal.pageSize.getHeight();
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          if (footerText) doc.text(footerText, 15, pageH - 8);
          if (showPageNumber) {
            doc.text(`Trang ${hookData.pageNumber}`, pageWidth - 15, pageH - 8, {
              align: "right",
            });
          }
        },
      });

      // Mở trong tab mới
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // Giải phóng URL sau 60 giây
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      console.error("[PdfService] previewTablePdf error:", error);
      throw new Error("Có lỗi xảy ra khi xem trước PDF");
    }
  }

  // ----------------------------------------------------------
  // IN TRỰC TIẾP (Print)
  // ----------------------------------------------------------

  /**
   * In bảng dữ liệu trực tiếp qua hộp thoại in của trình duyệt
   */
  async printTablePdf<T>(
    data: T[],
    columns: PdfColumn[],
    options: PdfOptions = {}
  ): Promise<void> {
    const {
      title,
      subtitle,
      orientation = "landscape",
      pageSize = "a4",
      fontSize = this.DEFAULT_FONT_SIZE,
      headerColor = this.DEFAULT_HEADER_COLOR,
      alternateRowColor = this.DEFAULT_ALT_ROW_COLOR,
    } = options;

    try {
      const doc = new jsPDF({ orientation, format: pageSize });
      const pageWidth = doc.internal.pageSize.getWidth();
      let currentY = 15;

      if (title) {
        doc.setFontSize(16);
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(title, pageWidth / 2, currentY, { align: "center" });
        currentY += 8;
      }

      if (subtitle) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(subtitle, pageWidth / 2, currentY, { align: "center" });
        currentY += 6;
      }

      if (title || subtitle) {
        doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.setLineWidth(0.5);
        doc.line(15, currentY, pageWidth - 15, currentY);
        currentY += 5;
      }

      const tableHeaders = columns.map((col) => ({
        content: col.header,
        styles: { halign: col.align || "left", fontStyle: "bold" } as Partial<Styles>,
      }));

      const tableRows: RowInput[] = data.map((item: any) =>
        columns.map((col) => {
          const value = this.getNestedValue(item, col.field);
          return col.formatter ? col.formatter(value) : this.formatCellValue(value);
        })
      );

      const tableWidth = pageWidth - 30;
      const totalWeight = columns.reduce((sum, col) => sum + (col.width || 1), 0);
      const columnStyles: Record<number, Partial<Styles>> = {};
      columns.forEach((col, idx) => {
        columnStyles[idx] = {
          cellWidth: ((col.width || 1) / totalWeight) * tableWidth,
        };
      });

      autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        startY: currentY,
        margin: { left: 15, right: 15 },
        styles: {
          fontSize,
          cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: headerColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        alternateRowStyles: { fillColor: alternateRowColor },
        columnStyles,
        didDrawPage: (hookData) => {
          const pageH = doc.internal.pageSize.getHeight();
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Trang ${hookData.pageNumber}`,
            pageWidth - 15,
            pageH - 8,
            { align: "right" }
          );
        },
      });

      // Mở cửa sổ in
      doc.autoPrint();
      const blob = doc.output("bloburl");
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blob as unknown as string;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 5000);
      };
    } catch (error) {
      console.error("[PdfService] printTablePdf error:", error);
      throw new Error("Có lỗi xảy ra khi in PDF");
    }
  }

  // ----------------------------------------------------------
  // IN HTML ELEMENT TRỰC TIẾP
  // ----------------------------------------------------------

  /**
   * In nội dung HTML của một element qua cửa sổ in trình duyệt
   */
  printHtmlElement(elementId: string, options?: { title?: string; css?: string }): void {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`[PdfService] Element #${elementId} không tồn tại`);
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      console.error("[PdfService] Không thể mở cửa sổ in (popup bị chặn?)");
      return;
    }

    const { title = "In trang", css = "" } = options || {};

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
            th { background: #1F4E79; color: white; font-weight: bold; }
            tr:nth-child(even) { background: #f0f7ff; }
            h1, h2, h3 { color: #1F4E79; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            ${css}
          </style>
        </head>
        <body>
          ${options?.title ? `<h2 style="text-align:center;margin-bottom:12px;">${options.title}</h2>` : ""}
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  // ----------------------------------------------------------
  // GET PDF AS BLOB (để upload lên server, v.v.)
  // ----------------------------------------------------------

  /**
   * Tạo PDF và trả về dưới dạng Blob để upload hoặc xử lý tiếp
   */
  async getPdfBlob<T>(
    data: T[],
    columns: PdfColumn[],
    options: PdfOptions = {}
  ): Promise<Blob> {
    const {
      title,
      subtitle,
      orientation = "landscape",
      pageSize = "a4",
      fontSize = this.DEFAULT_FONT_SIZE,
      headerColor = this.DEFAULT_HEADER_COLOR,
      alternateRowColor = this.DEFAULT_ALT_ROW_COLOR,
    } = options;

    const doc = new jsPDF({ orientation, format: pageSize });
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 15;

    if (title) {
      doc.setFontSize(16);
      doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text(title, pageWidth / 2, currentY, { align: "center" });
      currentY += 8;
    }

    if (subtitle) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(subtitle, pageWidth / 2, currentY, { align: "center" });
      currentY += 6;
    }

    const tableHeaders = columns.map((col) => col.header);
    const tableRows: RowInput[] = data.map((item: any) =>
      columns.map((col) => {
        const value = this.getNestedValue(item, col.field);
        return col.formatter ? col.formatter(value) : this.formatCellValue(value);
      })
    );

    const tableWidth = pageWidth - 30;
    const totalWeight = columns.reduce((sum, col) => sum + (col.width || 1), 0);
    const columnStyles: Record<number, Partial<Styles>> = {};
    columns.forEach((col, idx) => {
      columnStyles[idx] = {
        cellWidth: ((col.width || 1) / totalWeight) * tableWidth,
      };
    });

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: currentY,
      margin: { left: 15, right: 15 },
      styles: { fontSize, cellPadding: 3 },
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: alternateRowColor },
      columnStyles,
    });

    return doc.output("blob");
  }

  // ----------------------------------------------------------
  // PRIVATE HELPERS
  // ----------------------------------------------------------

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  private formatCellValue(value: any): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Có" : "Không";
    if (value instanceof Date) {
      return value.toLocaleDateString("vi-VN");
    }
    return String(value);
  }
}

export const pdfService = new PdfService();
