import { enumData } from "@/common/enums/enum";
import { formatDateTime } from "@/common/helpers/formatHelper";
import {
  type ActionLogDto,
  ActionType,
  useActionsLogPagination,
} from "@/hooks/actionLog";
import { memo, useMemo, useState } from "react";
import TableCustom, {
  type PaginationConfig,
  type TableColumn,
} from "./TableCustom";

interface ActionLogProps {
  functionType: string;
  functionId?: string;
}

function ActionLog({ functionType, functionId }: ActionLogProps) {
  const [paginationState, setPaginationState] = useState({
    pageIndex: enumData.PAGE.PAGEINDEX,
    pageSize: enumData.PAGE.PAGESIZE,
  });

  const queryPayload = useMemo(() => {
    const skip = (paginationState.pageIndex - 1) * paginationState.pageSize;
    const take = paginationState.pageSize;
    return {
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      skip: skip,
      take: take,
      where: {
        functionType: functionType,
        functionId: functionId || "",
      },
    };
  }, [
    paginationState.pageIndex,
    paginationState.pageSize,
    functionType,
    functionId,
  ]);

  const { data, total, isLoading } = useActionsLogPagination(queryPayload);

  const columns = useMemo<TableColumn<ActionLogDto>[]>(
    () => [
      {
        field: "createdAt",
        header: "Ngày tạo",
        body: (rowData: ActionLogDto) =>
          formatDateTime(rowData.createdAt, "DD/MM/YYYY HH:mm:ss"),
        style: { width: "160px" },
      },
      {
        field: "createdByName",
        header: "Người tạo",
        style: { width: "180px" },
      },
      {
        field: "createdByCode",
        header: "Mã nhân viên",
        style: { width: "120px" },
      },
      {
        field: "type",
        header: "Hành động",
        style: { width: "150px" },
        type: "tag",
        body: (rowData: ActionLogDto) => {
          return (ActionType as any)[rowData.type] || rowData.type;
        },
        tagSeverity: (val) => {
          const v = val?.toString().toUpperCase();
          if (v?.includes("CREATE")) return "success";
          if (v?.includes("UPDATE")) return "warning";
          if (v?.includes("DELETE")) return "danger";
          return "info";
        },
      },
      {
        field: "description",
        header: "Mô tả",
        style: { minWidth: "300px" },
      },
    ],
    [],
  );

  const paginationConfig = useMemo<PaginationConfig>(
    () => ({
      total: total || 0,
      current: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      showSizeChanger: true,
    }),
    [total, paginationState.pageIndex, paginationState.pageSize],
  );

  const handlePageChange = (page: number, pageSize: number) => {
    setPaginationState({
      pageIndex: page,
      pageSize: pageSize,
    });
  };

  if (!functionId) return null;

  return (
    <div className="mt-2">
      <TableCustom<ActionLogDto>
        data={data || []}
        columns={columns}
        loading={isLoading}
        pagination={paginationConfig}
        onPageChange={handlePageChange}
        stripedRows
        rowActions={[]}
      />
    </div>
  );
}

export default memo(ActionLog);
