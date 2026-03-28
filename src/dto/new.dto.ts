import type { BaseDto, FileDto } from "./common/base.dto";

export interface NewDto extends BaseDto {
  code: string;
  titleVI: string;
  titleEN: string;
  contentVI: string;
  contentEN: string;
  url: string;
  type: string;
  effectiveStartDate: Date;
  effectiveEndDate: Date;
  isVisible: boolean;
  status: string;
  rank?: number;
  images: FileDto[];
}

export interface CreateNewDto {
  code: string;
  titleVI: string;
  titleEN: string;
  contentVI: string;
  contentEN: string;
  url: string;
  type: string;
  effectiveStartDate: Date;
  effectiveEndDate: Date;
  isVisible: boolean;
  status: string;
  rank?: number;
  images: FileDto[];
}

export interface UpdateNewDto extends CreateNewDto {
  id: string;
}

export interface NewFilterDto {
  titleVI?: string;
  titleEN?: string;
  status?: string;
  type?: string;
}

export interface NewSelectBoxDto {
  id: string;
  titleVI: string;
  titleEN: string;
}
