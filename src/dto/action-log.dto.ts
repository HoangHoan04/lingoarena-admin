export interface ActionLogDto {
  id: string;
  createdAt: string;
  createdByCode: string;
  createdByName: string;
  type: string;
  description: string;
  dataOld?: string;
  dataNew?: string;
  functionType: string;
  functionId?: string;
}

export interface ActionLogFilter {
  functionType: string;
  functionId?: string;
  type?: string;
  createdBy?: string;
}
