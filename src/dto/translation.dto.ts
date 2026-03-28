import type { BaseDto } from "./common/base.dto";

export interface TranslationDto extends BaseDto {
  key: string;
  en: string;
  vi: string;
}

export interface CreateTranslationDto {
  key: string;
  en: string;
  vi: string;
}

export interface UpdateTranslationDto extends CreateTranslationDto {
  id: string;
}

export interface TranslationFilterDto {
  key?: string;
  vi?: string;
  en?: string;
}
