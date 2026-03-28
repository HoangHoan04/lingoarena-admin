import type { BaseDto, FileDto } from "./common/base.dto";

export interface TravelHintDto extends BaseDto {
  month: number;
  locationName: string;
  description: string;
  reason: string;
  type: string;
  tags: string[];
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  images: FileDto[];
}

export interface CreateTravelHintDto {
  month: number;
  locationName: string;
  description: string;
  reason: string;
  type: string;
  tags: string[];
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  images: FileDto[];
}

export interface UpdateTravelHintDto extends CreateTravelHintDto {
  id: string;
}

export interface TravelHintFilterDto {
  locationName?: string;
  type?: string;
  tags?: string[];
  isDeleted?: boolean;
}
