import { type BaseDto } from "./common/base.dto";

// Tour Price Filter DTO
export interface TourPriceFilterDto {
  code?: string;
  tourDetailId?: string;
}

export interface TourPriceDto extends BaseDto {
  code: string;
  price: number;
  priceType: string;
  currency: string;
  tourDetailId: string;
}

export interface CreateTourPriceDto {
  price: number;
  priceType: string;
  currency: string;
  tourDetailId: string;
}

export interface UpdateTourPriceDto extends CreateTourPriceDto {
  id: string;
}
