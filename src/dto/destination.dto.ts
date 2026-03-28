import type { BaseDto, FileDto } from "./common/base.dto";

export interface DestinationDto extends BaseDto {
  code: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  description: string;
  latitude: number;
  longitude: number;
  bestTimeToVisit: string;
  averageTemperature: string;
  popularActivities: string[];
  viewCount: number;
  rating: number;
  status: string;
  image: FileDto[];
}

export interface CreateDestinationDto {
  name: string;
  slug: string;
  country: string;
  region: string;
  description: string;
  latitude: number;
  longitude: number;
  bestTimeToVisit: string;
  averageTemperature: string;
  popularActivities: string[];
  image: FileDto[];
}

export interface UpdateDestinationDto extends CreateDestinationDto {
  id: string;
}

export interface DestinationFilterDto {
  name?: string;
  country?: string;
  region?: string;
  status?: string;
  isDeleted?: boolean;
}

export interface DestinationSelectBoxDto {
  id: string;
  name: string;
  country: string;
  region: string;
}
