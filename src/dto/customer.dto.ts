import type { BaseDto, FileDto } from "./common/base.dto";

export interface CustomerDto extends BaseDto {
  code: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  gender?: string;
  birthday: Date;
  nationality?: string;
  identityCard?: string;
  passportNumber?: string;
  status?: string;
  description?: string;
  avatar: FileDto[];
  user: any;
}

export interface CreateCustomerDto {
  code: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  gender?: string;
  birthday: Date;
  nationality?: string;
  identityCard?: string;
  passportNumber?: string;
  description?: string;
  avatar: FileDto[];
}

export interface UpdateCustomerDto extends CreateCustomerDto {
  id: string;
}

export interface CustomerFilterDto {
  code?: string;
  name?: string;
  phone?: string;
  isDeleted?: boolean;
}

export interface CustomerSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
