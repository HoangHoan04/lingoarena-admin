import { ROUTES } from "@/common/constants/routes";
import { enumData } from "@/common/enums/enum";
import ActionConfirm, {
  type ActionConfirmRef,
} from "@/components/ui/ActionConfirm";
import BaseView from "@/components/ui/BaseView";
import { CommonActions } from "@/components/ui/CommonAction";
import FilterComponent, {
  type FilterField,
} from "@/components/ui/FilterCustom";
import RowActions from "@/components/ui/RowAction";
import StatusTag from "@/components/ui/StatusTag";
import TableCustom, {
  type RowAction,
  type TableColumn,
} from "@/components/ui/TableCustom";
import type { PaginationDto } from "@/dto";
import type { TourGuideDto, TourGuideFilterDto } from "@/dto/tour-guide.dto";
import {
  useActivateTourGuide,
  useDeactivateTourGuide,
  useExportTourGuideExcel,
  useImportTourGuideExcel,
  usePaginationTourGuide,
} from "@/hooks/tour-guide";
import { useRouter } from "@/routers/hooks";
import {
  excelService,
  pdfService,
  type ExcelColumn,
  type PdfColumn,
} from "@/services";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

// ============================================================
// CONSTANTS
// ============================================================

export const initFilter: TourGuideFilterDto = {
  code: "",
  name: "",
  email: "",
  isDeleted: undefined,
};

/** Cột dùng cho file mẫu import (chỉ những trường cần thiết) */
const TEMPLATE_COLUMNS: ExcelColumn[] = [
  // NOTE: Header phải khớp 100% với mapping import (HEADER_MAP)
  // Backend đang validate theo nhãn "Họ tên"
  { field: "name", header: "Họ tên", width: 25, required: true },
  { field: "phone", header: "Số điện thoại", width: 18, required: true },
  { field: "email", header: "Email", width: 28, required: true },
  { field: "address", header: "Địa chỉ", width: 30 },
  {
    field: "gender",
    header: "Giới tính",
    width: 14,
    formatter: () => "Nam / Nữ",
  },
  { field: "birthday", header: "Ngày sinh", width: 16, required: true },
  { field: "nationality", header: "Quốc tịch", width: 16 },
  { field: "identityCard", header: "Số CCCD/CMND", width: 18 },
  { field: "passportNumber", header: "Số hộ chiếu", width: 18 },
  { field: "licenseNumber", header: "Số chứng chỉ", width: 18 },
  { field: "licenseIssuedDate", header: "Ngày cấp CC", width: 16 },
  { field: "licenseExpiryDate", header: "Ngày hết hạn CC", width: 18 },
  { field: "licenseIssuedBy", header: "Nơi cấp CC", width: 22 },
  { field: "yearsOfExperience", header: "Kinh nghiệm (năm)", width: 18 },
  { field: "baseSalary", header: "Lương cơ bản", width: 18 },
  { field: "commissionRate", header: "Hoa hồng (%)", width: 16 },
  { field: "bankAccountNumber", header: "Số TK Ngân hàng", width: 20 },
  { field: "bankName", header: "Tên ngân hàng", width: 20 },
  { field: "bankAccountName", header: "Chủ tài khoản", width: 22 },
  { field: "shortBio", header: "Giới thiệu ngắn", width: 35 },
];

/** Cột dùng cho xuất PDF */
const PDF_COLUMNS: PdfColumn[] = [
  { field: "code", header: "Mã HDV", width: 1, align: "center" },
  { field: "name", header: "Họ và tên", width: 2 },
  { field: "email", header: "Email", width: 2.5 },
  { field: "phone", header: "Điện thoại", width: 1.5, align: "center" },
  {
    field: "gender",
    header: "Giới tính",
    width: 1,
    align: "center",
    formatter: (v) =>
      v === "MALE" ? "Nam" : v === "FEMALE" ? "Nữ" : (v ?? ""),
  },
  {
    field: "yearsOfExperience",
    header: "Kinh nghiệm",
    width: 1,
    align: "center",
    formatter: (v) => (v != null ? `${v} năm` : ""),
  },
  { field: "licenseNumber", header: "Số GP", width: 1.5, align: "center" },
  {
    field: "isDeleted",
    header: "Trạng thái",
    width: 1.2,
    align: "center",
    formatter: (v) => (v ? "Ngưng HĐ" : "Đang HĐ"),
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function TourGuideManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<TourGuideFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<TourGuideFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<TourGuideDto[]>([]);
  const [selectedTourGuide, setSelectedTourGuide] =
    useState<TourGuideDto | null>(null);

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationTourGuide(pagination);
  const { onDeactivateTourGuide, isLoading: isLoadingDeactivate } =
    useDeactivateTourGuide();
  const { onActivateTourGuide, isLoading: isLoadingActivate } =
    useActivateTourGuide();
  const { onExportTourGuideExcel, isLoading: isLoadingExportExcel } =
    useExportTourGuideExcel();
  const { onImportTourGuideExcel, isLoading: isLoadingImportExcel } =
    useImportTourGuideExcel();

  // ------------------------------------------------------------
  // Filter / Paginate handlers
  // ------------------------------------------------------------

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as TourGuideFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  // ------------------------------------------------------------
  // Activate / Deactivate handlers
  // ------------------------------------------------------------

  const handleActivate = async () => {
    if (!selectedTourGuide) return;
    await onActivateTourGuide(selectedTourGuide.id);
    await refetch();
    setSelectedTourGuide(null);
  };

  const handleDeactivate = async () => {
    if (!selectedTourGuide) return;
    await onDeactivateTourGuide(selectedTourGuide.id);
    await refetch();
    setSelectedTourGuide(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children
        .ADD_TOUR_GUIDE.path,
    );
  };

  // ------------------------------------------------------------
  // ✅ Excel handlers
  // ------------------------------------------------------------

  /** Xuất toàn bộ dữ liệu trang hiện tại ra Excel */
  const handleExportExcel = async () => {
    try {
      await onExportTourGuideExcel({
        ...pagination,
        where: pagination.where,
      });
    } catch (err: any) {
      console.error("[ExportExcel]", err.message);
    }
  };

  /** Tải file mẫu Excel để nhập dữ liệu */
  const handleDownloadTemplate = async () => {
    try {
      await excelService.downloadTemplate(
        TEMPLATE_COLUMNS,
        "mau-nhap-huong-dan-vien.xlsx",
        {
          sheetName: "Dữ liệu HDV",
          notes:
            "- Các cột có dấu (*) là bắt buộc, không được để trống.\n" +
            "- Giới tính: nhập 'Nam' hoặc 'Nữ'.\n" +
            "- Ngày sinh / Ngày cấp / Ngày hết hạn: định dạng dd/mm/yyyy (ví dụ: 15/03/1990).\n" +
            "- Lương cơ bản: nhập số (không cần ký hiệu VND).\n" +
            "- Hoa hồng (%): nhập số từ 0 đến 100.\n" +
            "- Không xóa hàng tiêu đề.",
          sampleData: [
            {
              name: "Nguyễn Văn An",
              phone: "0912345678",
              email: "nguyenvanan@email.com",
              address: "123 Đường ABC, TP.HCM",
              gender: "Nam",
              birthday: "15/03/1990",
              nationality: "Việt Nam",
              identityCard: "012345678901",
              passportNumber: "B1234567",
              licenseNumber: "CC-HDV-2024-001",
              licenseIssuedDate: "01/01/2024",
              licenseExpiryDate: "01/01/2029",
              licenseIssuedBy: "Sở Du lịch TP.HCM",
              yearsOfExperience: 3,
              baseSalary: 12000000,
              commissionRate: 5,
              bankAccountNumber: "0123456789",
              bankName: "Vietcombank",
              bankAccountName: "NGUYEN VAN AN",
              shortBio: "Hướng dẫn viên nội địa, nhiệt tình và đúng giờ.",
            },
          ],
        },
      );
    } catch (err: any) {
      console.error("[DownloadTemplate]", err.message);
    }
  };

  /** Import từ file Excel người dùng chọn */
  const handleImportExcel = async () => {
    try {
      const file = await excelService.openFileDialog();
      if (!file) return;

      const res: any = await onImportTourGuideExcel(file);
      if (res?.failed > 0) {
        console.warn("[ImportTourGuideExcel] errors:", res?.errors || []);
      }
      await refetch();
    } catch (err: any) {
      console.error("[ImportExcel]", err.message);
    }
  };

  // ------------------------------------------------------------
  // ✅ PDF handlers
  // ------------------------------------------------------------

  const PDF_OPTIONS = {
    title: "DANH SÁCH HƯỚNG DẪN VIÊN",
    subtitle: "Hệ thống quản lý BookingTour Admin",
    orientation: "landscape" as const,
    pageSize: "a4" as const,
    headerColor: [31, 78, 121] as [number, number, number],
    alternateRowColor: [235, 243, 255] as [number, number, number],
    showPageNumber: true,
    showDate: true,
    footerText: "BookingTour Admin System — Tài liệu nội bộ",
  };

  /** Xuất danh sách ra file PDF và tải xuống */
  const handleExportPdf = async () => {
    try {
      await pdfService.exportTableToPdf(data || [], PDF_COLUMNS, {
        ...PDF_OPTIONS,
        filename: `danh-sach-huong-dan-vien_${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}.pdf`,
      });
    } catch (err: any) {
      console.error("[ExportPdf]", err.message);
    }
  };

  /** Xem trước PDF trong tab mới */
  const handlePreviewPdf = async () => {
    try {
      await pdfService.previewTablePdf(data || [], PDF_COLUMNS, PDF_OPTIONS);
    } catch (err: any) {
      console.error("[PreviewPdf]", err.message);
    }
  };

  /** In danh sách trực tiếp */
  const handlePrint = async () => {
    try {
      await pdfService.printTablePdf(data || [], PDF_COLUMNS, PDF_OPTIONS);
    } catch (err: any) {
      console.error("[PrintPdf]", err.message);
    }
  };

  // ------------------------------------------------------------
  // Table config
  // ------------------------------------------------------------

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã hướng dẫn viên",
      type: "input",
      placeholder: "Nhập mã hướng dẫn viên",
      col: 6,
    },
    {
      key: "name",
      label: "Tên hướng dẫn viên",
      type: "input",
      placeholder: "Nhập tên hướng dẫn viên",
      col: 6,
    },
    {
      key: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      options: Object.values(enumData.STATUS_FILTER || {}).map((item: any) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
  ];

  const columns: TableColumn<TourGuideDto>[] = [
    {
      field: "code",
      header: "Mã hướng dẫn viên",
      width: 120,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên hướng dẫn viên",
      width: 200,
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      width: 200,
      sortable: true,
    },
    {
      field: "gender",
      header: "Giới tính",
      width: 220,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      body: (rowData: TourGuideDto) => (
        <StatusTag
          severity={rowData.isDeleted ? "danger" : "success"}
          value={
            rowData.isDeleted
              ? enumData.STATUS_FILTER.INACTIVE.name
              : enumData.STATUS_FILTER.ACTIVE.name
          }
        />
      ),
    },
  ];

  const rowActions: RowAction<TourGuideDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children.DETAIL_TOUR_GUIDE.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "success",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.USER_MANAGER.children.TOUR_GUIDE_MANAGER.children.EDIT_TOUR_GUIDE.path.replace(
            ":id",
            record.id,
          ),
        );
      },
    },
    {
      key: "deactivate",
      icon: PrimeIcons.BAN,
      tooltip: "Ngưng hoạt động",
      severity: "warning",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        setSelectedTourGuide(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => record.isDeleted,
      onClick: (record) => {
        setSelectedTourGuide(record);
        activateConfirmRef.current?.show();
      },
    },
  ];

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<TourGuideDto>
        data={data || []}
        columns={columns}
        loading={
          isLoading ||
          isLoadingActivate ||
          isLoadingDeactivate ||
          isLoadingExportExcel ||
          isLoadingImportExcel
        }
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy hướng dẫn viên nào"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
          showTotal: true,
        }}
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <>
              {/* Thêm mới */}
              <RowActions
                actions={[CommonActions.create(handleCreate)]}
                justify="start"
                gap="medium"
              />

              {/* Xuất Excel */}
              <RowActions
                actions={[CommonActions.exportExcel(handleExportExcel)]}
                justify="start"
                gap="medium"
              />

              {/* Import Excel (tải mẫu + upload) */}
              <RowActions
                actions={[
                  CommonActions.uploadExcel(
                    handleDownloadTemplate,
                    handleImportExcel,
                  ),
                ]}
                justify="start"
                gap="medium"
              />

              {/* Xuất PDF */}
              <RowActions
                actions={[CommonActions.exportPdf(handleExportPdf)]}
                justify="start"
                gap="medium"
              />

              {/* Xem trước PDF */}
              <RowActions
                actions={[
                  {
                    key: "preview-pdf",
                    label: "Xem trước PDF",
                    icon: PrimeIcons.FILE,
                    severity: "info",
                    onClick: handlePreviewPdf,
                  },
                ]}
                justify="start"
                gap="medium"
              />

              {/* In */}
              <RowActions
                actions={[CommonActions.print(handlePrint)]}
                justify="start"
                gap="medium"
              />
            </>
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt hướng dẫn viên"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động hướng dẫn viên"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        withReason={true}
        isRequireReason={true}
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
