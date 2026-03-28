import type { BaseDto } from "./common/base.dto";
import type { CreateTourDetailDto, TourDetailDto } from "./tour-detail.dto";

// Tour DTO
export interface TourDto extends BaseDto {
  code: string;
  title: string;
  slug: string;
  location: string;
  durations: string;
  shortDescription: string;
  longDescription?: string;
  highlights?: string;
  included?: string;
  excluded?: string;
  rating: number;
  reviewCount: number;
  viewCount: number;
  bookingCount: number;
  category?: string;
  tags?: string[];
  status: string;
  tourDestinations?: any[];
  __tourDetails__?: TourDetailDto[];
  reviews?: any[];
}

export interface CreateTourDto {
  title: string;
  slug?: string;
  location: string;
  durations: string;
  shortDescription: string;
  longDescription?: string;
  highlights?: string;
  included?: string;
  excluded?: string;
  category?: string;
  tags?: string[];
  status?: string;
  tourDetails?: CreateTourDetailDto[];
}

export interface UpdateTourDto extends CreateTourDto {
  id: string;
}

export interface TourFilterDto {
  title?: string;
  code?: string;
  location?: string;
  category?: string;
  tags?: string[];
  status?: string;
  isDeleted?: boolean;
}

export interface UpdateTourDto extends CreateTourDto {
  id: string;
}

export interface TourFilterDto {
  code?: string;
  title?: string;
}

export interface TourSelectBoxDto {
  id: string;
  title: string;
  code: string;
}
