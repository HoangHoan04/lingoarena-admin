import type { BaseDto, FileDto } from "./common/base.dto";

export interface TourGuideDto extends BaseDto {
  code: string;
  name: string;
  phone: string;
  slug: string;
  email: string;
  address?: string;
  gender?: string;
  birthday: Date;
  nationality?: string;
  identityCard?: string;
  passportNumber?: string;
  shortBio?: string;
  bio?: string;
  languages?: string[];
  specialties?: string[];
  yearsOfExperience?: number;
  licenseNumber?: string;
  licenseIssuedDate?: Date;
  licenseExpiryDate?: Date;
  licenseIssuedBy?: string;
  averageRating?: number;
  totalReviews?: number;
  totalToursCompleted?: number;
  status: string;
  description?: string;
  baseSalary?: number;
  commissionRate?: number;
  startDate?: Date;
  endDate?: Date;
  isAvailable: boolean;
  bankAccountNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  avatar: FileDto[];
}
export interface TourGuideFilterDto {
  code?: string;
  name?: string;
  email?: string;
  isDeleted?: boolean;
}

export interface TourGuideSelectBoxDto {
  id: string;
  name: string;
}

export interface UpdateTourGuideDto extends CreateTourGuideDto {
  id: string;
}

export interface CreateTourGuideDto {
  name: string;
  phone: string;
  email: string;
  address?: string;
  gender?: string;
  birthday: Date;
  nationality?: string;
  identityCard?: string;
  passportNumber?: string;
  shortBio?: string;
  bio?: string;
  languages?: string[];
  specialties?: string[];
  yearsOfExperience?: number;
  licenseNumber?: string;
  licenseIssuedDate?: Date;
  licenseExpiryDate?: Date;
  licenseIssuedBy?: string;
  description?: string;
  baseSalary?: number;
  commissionRate?: number;
  startDate?: Date;
  endDate?: Date;
  isAvailable: boolean;
  bankAccountNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  avatar?: FileDto[];
}
