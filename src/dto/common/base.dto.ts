export interface BaseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
  isCanEdit?: boolean;
  isCanDelete?: boolean;
  isCanView?: boolean;
  isCanCreate?: boolean;
  isCanDeActive?: boolean;
  statusName?: string;
  statusColor?: string;
  status?: string;
}
export interface PaginationDto<T> {
  skip: number;
  take: number;
  where: T;
}

export interface IdNumberReq {
  id: number;
}
export interface UUIDReq {
  id: string;
}

export interface PrimaryBaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  version?: number;
}

type TOperatorText = "=" | "LIKE" | "NOT LIKE";
type TOperatorNumber = "=" | "!=" | "<" | ">" | ">=" | "<=";
type TOperatorDate = "=" | "!=" | "<" | ">" | ">=" | "<=";
type TOperatorSelect = "IN" | "NOT IN";
type TOperatorBoolean = "=";

export class FilterItemText {
  type = "TEXT" as const;
  value: string = "";
  compare?: TOperatorText = "LIKE";
}
export class FilterItemNumber {
  type = "NUMBER" as const;
  value: number | undefined;
  compare?: TOperatorNumber = "=";
}
export class FilterItemDate {
  type = "DATE" as const;
  value: Date | undefined;
  compare?: TOperatorDate = "=";
}
export class FilterItemBoolean {
  type = "BOOLEAN" as const;
  value?: boolean | "";
  compare?: TOperatorBoolean = "=";
}

export class FilterItemSelect {
  type = "SELECT" as const;
  value: any[] = [];
  compare?: TOperatorSelect = "IN";
}

export type FilterOption<T = any> = {
  [k in keyof T]?:
    | FilterItemText
    | FilterItemNumber
    | FilterItemDate
    | FilterItemBoolean
    | FilterItemSelect;
};

export type OrderOption<T = any> = {
  [k in keyof T]?: "ASC" | "DESC" | "";
};

export class PageRequest<T = any> {
  pageSize?: number;
  pageIndex = 1;
  filters?: FilterOption<T>;
  orders?: OrderOption<T>;
}

export class PageResponse<T = any> {
  data: T[] = [];
  total: number = 0;
}

export interface FileDto {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string | null;
  isDeleted?: boolean;
  version?: number;
  fileUrl: string;
  fileName: string;
  fileType?: string | null;
  customerId?: string | null;
  employeeId?: string | null;
}
