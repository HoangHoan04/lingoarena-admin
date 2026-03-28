import type { BaseDto } from "./common/base.dto";

export interface RoleDto extends BaseDto {
  name: string;
  code: string;
  description?: string;
  isSystem: boolean;
  permissionIds: string[];
}

export interface CreateRoleDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateRoleDto extends CreateRoleDto {
  id: string;
}

export interface RoleFilterDto {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface RoleSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
