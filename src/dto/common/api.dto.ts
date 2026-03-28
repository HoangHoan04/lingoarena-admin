export interface SuccessResponse<T = any> {
  message: string;
  data: T;
}
export interface ErrorResponse {
  message: string;
  statusCode?: number;
}
