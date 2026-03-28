import { type BaseDto } from "./common/base.dto";

export interface TourDetailFilterDto {
  tourId?: string;
}

export interface CreateTourDetailDto {
  startDay: Date;
  endDay: Date;
  startLocation: string;
  capacity: number;
  status?: string;
  tourGuideId?: string;
}

export interface UpdateTourDetailDto extends CreateTourDetailDto {
  id: string;
}

export interface TourDetailDto extends BaseDto {
  tourId?: string;
  code: string;
  startDay: Date;
  endDay: Date;
  startLocation: string;
  capacity: number;
  remainingSeats: number;
  status: string;
  tourGuideId?: string;
}
