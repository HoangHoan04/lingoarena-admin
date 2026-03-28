import { empty } from "@/assets/animations";
import { enumData } from "@/common/enums/enum";
import Lottie from "lottie-react";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Column, type ColumnBodyOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState, type ReactNode } from "react";

export interface TableColumn<T = any> {
  field: string;
  header: string;
  width?: string | number;
  body?: (rowData: T, options: ColumnBodyOptions) => ReactNode;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  filterMatchMode?:
    | "startsWith"
    | "contains"
    | "endsWith"
    | "equals"
    | "notEquals";
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  frozen?: boolean;
  alignFrozen?: "left" | "right";
  align?: "left" | "center" | "right";
  hidden?: boolean;
  resizable?: boolean;
  type?:
    | "text"
    | "number"
    | "currency"
    | "date"
    | "datetime"
    | "boolean"
    | "badge"
    | "tag";
  dateFormat?: string;
  currencySymbol?: string;
  numberFormat?: Intl.NumberFormatOptions;
  badgeSeverity?: (
    value: any,
  ) => "success" | "info" | "warning" | "danger" | "secondary";
  tagSeverity?: (
    value: any,
  ) => "success" | "info" | "warning" | "danger" | "secondary";
  renderBoolean?: (value: boolean) => ReactNode;
  renderEmpty?: () => ReactNode;
  render?: (rowData: T) => ReactNode;
}

export interface RowAction<T = any> {
  key: string;
  label?: string;
  icon?: ReactNode;
  tooltip?: string;
  severity?: "secondary" | "success" | "info" | "warning" | "danger" | "help";
  outlined?: boolean;
  text?: boolean;
  onClick?: (record: T, index: number) => void;
  render?: (record: T, index: number) => ReactNode;
  disabled?: boolean | ((record: T) => boolean);
  visible?: boolean | ((record: T) => boolean);
  loading?: boolean | ((record: T) => boolean);
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showTotal?: boolean;
  totalTemplate?: string;
}

export interface ToolbarConfig {
  show?: boolean;
  align?: "left" | "center" | "right" | "between";
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyText?: ReactNode;
  dataKey?: string;
  pagination?: PaginationConfig;
  onPageChange?: (page: number, pageSize: number) => void;
  enableSelection?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  selectionMode?: "single" | "multiple";
  rowActions?: RowAction<T>[];
  rowActionsWidth?: string | number;
  rowActionsStyle?: React.CSSProperties;
  rowActionsFrozen?: boolean;
  toolbar?: ToolbarConfig;
  stripedRows?: boolean;
  showGridlines?: boolean;
  size?: "small" | "normal" | "large";
  responsiveLayout?: "scroll" | "stack";
  scrollable?: boolean;
  maxHeight?: string;
  virtualScrollerOptions?: any;
  resizableColumns?: boolean;
  reorderableColumns?: boolean;
  rowStyle?: (data: T) => React.CSSProperties;
  onRowClick?: (event: any) => void;
  onRowDoubleClick?: (event: any) => void;
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null;
  onSort?: (event: any) => void;
  style?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
}

function TableCustom<T extends Record<string, any>>({
  data = [],
  columns,
  loading = false,
  emptyText,
  dataKey = "id",
  pagination,
  onPageChange,
  enableSelection = false,
  selectedRows = [],
  onSelectionChange,
  selectionMode = "multiple",
  rowActions = [],
  rowActionsStyle,
  rowActionsFrozen = true,
  toolbar,
  stripedRows = false,
  showGridlines = true,
  scrollable = true,
  maxHeight,
  virtualScrollerOptions,
  resizableColumns = false,
  reorderableColumns = false,
  onRowClick,
  onRowDoubleClick,
  sortField,
  sortOrder,
  onSort,
  style,
  tableStyle,
}: DataTableProps<T>) {
  const [first, setFirst] = useState(
    pagination ? (pagination.current - 1) * pagination.pageSize : 0,
  );
  const [rows, setRows] = useState(pagination?.pageSize || 10);

  useEffect(() => {
    if (pagination) {
      setFirst((pagination.current - 1) * pagination.pageSize);
      setRows(pagination.pageSize);
    }
  }, [pagination]);

  const handlePageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
    onPageChange?.(e.page + 1, e.rows);
  };

  const isActionVisible = (action: RowAction<T>, rowData: T) =>
    action.visible === undefined
      ? true
      : typeof action.visible === "function"
        ? action.visible(rowData)
        : action.visible;

  const isActionDisabled = (action: RowAction<T>, rowData: T) =>
    action.disabled === undefined
      ? false
      : typeof action.disabled === "function"
        ? action.disabled(rowData)
        : action.disabled;

  const isActionLoading = (action: RowAction<T>, rowData: T) =>
    action.loading === undefined
      ? false
      : typeof action.loading === "function"
        ? action.loading(rowData)
        : action.loading;

  const formatters = {
    date: (value: any, format?: string) => {
      if (!value) return "-";
      const date = new Date(value);
      return format === "date"
        ? date.toLocaleDateString("vi-VN")
        : date.toLocaleString("vi-VN");
    },
    currency: (value: any, symbol: string = "₫") =>
      value == null
        ? "-"
        : `${Number(value).toLocaleString("vi-VN")} ${symbol}`,
    number: (value: any, options?: Intl.NumberFormatOptions) =>
      value == null ? "-" : Number(value).toLocaleString("vi-VN", options),
    boolean: (value: any, customRender?: (value: boolean) => ReactNode) =>
      customRender ? (
        customRender(value)
      ) : value ? (
        <Tag value="Có" severity="success" />
      ) : (
        <Tag value="Không" severity="danger" />
      ),
    badge: (
      value: any,
      getSeverity?: (
        value: any,
      ) => "success" | "info" | "warning" | "danger" | "secondary",
    ) => {
      if (!value) return "-";
      const severity = getSeverity ? getSeverity(value) : "info";
      return <Tag value={value} severity={severity} />;
    },
  };

  const renderColumnBody =
    (col: TableColumn<T>) => (rowData: T, options: ColumnBodyOptions) => {
      if (col.body) return col.body(rowData, options);
      if (col.render) return col.render(rowData);
      const value = rowData[col.field];
      if (value == null || value === "")
        return col.renderEmpty ? col.renderEmpty() : "-";
      switch (col.type) {
        case "date":
          return formatters.date(value, "date");
        case "datetime":
          return formatters.date(value, "datetime");
        case "currency":
          return formatters.currency(value, col.currencySymbol);
        case "number":
          return formatters.number(value, col.numberFormat);
        case "boolean":
          return formatters.boolean(value, col.renderBoolean);
        case "badge":
          return formatters.badge(value, col.badgeSeverity);
        case "tag":
          return formatters.badge(value, col.tagSeverity);
        default:
          return value;
      }
    };

  const actionBodyTemplate = (rowData: T, options: ColumnBodyOptions) => {
    const visibleActions = rowActions.filter((action) =>
      isActionVisible(action, rowData),
    );
    if (!visibleActions.length) return null;

    const getGridCols = (count: number) => {
      if (count <= 3) return count;
      if (count <= 6) return 3;
      return 4;
    };

    const gridCols = getGridCols(visibleActions.length);

    return (
      <div
        className="inline-grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 30px)`,
          justifyContent: "center",
        }}
      >
        {visibleActions.map((action, index) => {
          const disabled = isActionDisabled(action, rowData);
          const loadingState = isActionLoading(action, rowData);
          const buttonId = `action-${action.key}-${options.rowIndex}-${index}`;
          const isLastButtons = index >= visibleActions.length - 2;
          const tooltipPosition = isLastButtons ? "left" : "top";

          const mainColor = (() => {
            switch (action.severity) {
              case "secondary":
                return "#9e9e9e";
              case "success":
                return "#2e7d32";
              case "info":
                return "#0288d1";
              case "warning":
                return "#ed6c02";
              case "danger":
                return "#d32f2f";
              default:
                return "#1976d2";
            }
          })();

          return (
            <Button
              key={action.key}
              id={buttonId}
              icon={action.icon}
              disabled={disabled}
              loading={loadingState}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.(rowData, options.rowIndex);
              }}
              data-pr-tooltip={action.tooltip || ""}
              data-pr-position={tooltipPosition}
              className="bg-transparent! hover:bg-black/5! shadow-none! action-button-tooltip"
              style={{
                width: 30,
                height: 30,
                minWidth: 30,
                padding: "2px",
                fontSize: 16,
                cursor: disabled ? "not-allowed" : "pointer",
                border: `2px solid ${mainColor}`,
                color: mainColor,
                backgroundColor: "transparent",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
              }}
            />
          );
        })}
      </div>
    );
  };
  const getToolbarStyle = () => {
    const justifyClass =
      toolbar?.align === "left"
        ? "justify-start"
        : toolbar?.align === "center"
          ? "justify-center"
          : toolbar?.align === "right"
            ? "justify-end"
            : "justify-between";
    return justifyClass;
  };

  const getSelectionProps = () => {
    if (!enableSelection) return {};
    if (selectionMode === "single")
      return {
        selection: selectedRows?.[0] || null,
        onSelectionChange: (e: any) =>
          onSelectionChange?.([e.value].filter(Boolean)),
        selectionMode: "single" as const,
      };
    return {
      selection: selectedRows,
      onSelectionChange: (e: any) => onSelectionChange?.(e.value),
      selectionMode: "checkbox" as const,
    };
  };

  const visibleColumns = columns.filter((col) => !col.hidden);

  return (
    <div className="p-0 bg-transparent text-sm" style={style}>
      <style>{`
        .custom-scroll-table .p-datatable-wrapper::-webkit-scrollbar {
          display: none;
        }
        .custom-scroll-table .p-datatable-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
          height: auto !important; 
          max-height: ${maxHeight || "none"};
        }
        .my-custom-tooltip {
          pointer-events: none !important;
        }
        .my-custom-tooltip.p-tooltip {
          z-index: 10000 !important;
        }
        .my-custom-tooltip .p-tooltip-text {
          padding: 6px 12px !important;
          font-size: 13px !important;
          background-color: #1e293b !important;
          border-radius: 6px !important;
          color: white !important;
          white-space: nowrap !important;
        }
        .my-custom-tooltip.p-tooltip-top .p-tooltip-arrow {
          border-top-color: #1e293b !important;
        }
        .my-custom-tooltip.p-tooltip-bottom .p-tooltip-arrow {
          border-bottom-color: #1e293b !important;
        }
        .my-custom-tooltip.p-tooltip-left .p-tooltip-arrow {
          border-left-color: #1e293b !important;
        }
        .my-custom-tooltip.p-tooltip-right .p-tooltip-arrow {
          border-right-color: #1e293b !important;
        }
        .action-button-tooltip {
          position: relative !important;
        }
      `}</style>
      {toolbar?.show && (
        <div
          className={`flex items-center gap-3 mb-2 p-0 ${getToolbarStyle()}`}
        >
          <div className="flex items-center gap-3">{toolbar.leftContent}</div>
          <div className="flex items-center gap-3">
            {toolbar.showRefreshButton && (
              <Button
                icon={PrimeIcons.REFRESH}
                data-pr-tooltip="Làm mới"
                data-pr-position="top"
                severity="info"
                outlined
                onClick={toolbar.onRefresh}
                disabled={loading}
                className="action-button-tooltip"
                style={{ fontSize: 14 }}
              />
            )}
            {toolbar.rightContent}
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center min-h-96 ">
          <ProgressSpinner />
        </div>
      ) : data.length > 0 ? (
        <div className=" overflow-hidden">
          <DataTable
            value={data}
            dataKey={dataKey}
            {...getSelectionProps()}
            cellSelection={false}
            stripedRows={stripedRows}
            showGridlines={showGridlines}
            scrollable={scrollable}
            virtualScrollerOptions={virtualScrollerOptions}
            resizableColumns={resizableColumns}
            reorderableColumns={reorderableColumns}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            className="custom-scroll-table"
            style={{ width: "100%", ...tableStyle }}
          >
            {enableSelection && (
              <Column
                selectionMode={
                  selectionMode === "single" ? "single" : "multiple"
                }
                headerStyle={{
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 16px",
                }}
                bodyStyle={{
                  width: 50,
                  padding: "12px 16px",
                }}
                frozen
              />
            )}
            {visibleColumns.map((col) => (
              <Column
                key={col.field}
                field={col.field}
                header={col.header}
                body={renderColumnBody(col)}
                sortable={col.sortable}
                filter={col.filter}
                filterPlaceholder={col.filterPlaceholder}
                filterMatchMode={col.filterMatchMode}
                style={{
                  textAlign: col.align || "left",
                  fontSize: 14,
                  padding: "12px 16px",
                  ...col.style,
                }}
                headerStyle={{
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 16px",
                  ...col.headerStyle,
                }}
                bodyStyle={{
                  fontSize: 14,
                  padding: "12px 16px",
                  ...col.bodyStyle,
                }}
                frozen={col.frozen}
                alignFrozen={col.alignFrozen}
              />
            ))}
            {rowActions.length > 0 && (
              <Column
                key="actions"
                header="Thao tác"
                body={actionBodyTemplate}
                style={{
                  width: (() => {
                    const maxActions = Math.max(
                      ...data.map(
                        (row) =>
                          rowActions.filter((action) =>
                            isActionVisible(action, row),
                          ).length,
                      ),
                      1,
                    );
                    if (maxActions <= 3) {
                      const cols = maxActions;
                      return `${cols * 30 + (cols - 1) * 4 + 32}px`;
                    }
                    if (maxActions <= 6) {
                      const cols = 3;
                      return `${cols * 30 + (cols - 1) * 4 + 32}px`;
                    }
                    const cols = 4;
                    return `${cols * 30 + (cols - 1) * 4 + 32}px`;
                  })(),
                  fontSize: 14,
                  textAlign: "center",
                  padding: "8px 16px",
                  ...rowActionsStyle,
                }}
                headerStyle={{
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                  padding: "12px 16px",
                }}
                frozen={rowActionsFrozen}
                alignFrozen="right"
              />
            )}
          </DataTable>
        </div>
      ) : (
        <div className="flex justify-center items-center p-8 flex-col gap-4">
          <div className="w-52 h-36">
            <Lottie animationData={empty} loop />
          </div>
          <span className="text-base font-medium ">
            {emptyText || "Không có dữ liệu"}
          </span>
        </div>
      )}
      {pagination && !loading && data.length > 0 && (
        <div className="flex mt-5 bg-inherit px-2 w-full">
          <Paginator
            currentPageReportTemplate="Phân trang"
            totalRecords={pagination.total}
            rows={rows}
            first={first}
            onPageChange={handlePageChange}
            rowsPerPageOptions={enumData.PAGE.LST_PAGESIZE}
            template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            className="w-full bg-transparent border-none custom-grid-paginator"
          />
        </div>
      )}
      <Tooltip
        target=".action-button-tooltip"
        position="top"
        showDelay={200}
        hideDelay={0}
        className="my-custom-tooltip"
        mouseTrack
        mouseTrackTop={10}
      />
    </div>
  );
}

export default TableCustom;
