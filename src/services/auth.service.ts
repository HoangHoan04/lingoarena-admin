import type {
  LoginReq,
  RefreshTokenReq,
  RefreshTokenResponseDto,
  UserInfoResponseDto,
  UserLogInResponseDto,
} from "@/dto/auth.dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const authService = {
  login: async (data: LoginReq): Promise<UserLogInResponseDto> => {
    const response = await rootApiService.post<UserLogInResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );
    return response;
  },

  refreshToken: async (
    data: RefreshTokenReq,
  ): Promise<RefreshTokenResponseDto> => {
    const response = await rootApiService.post<RefreshTokenResponseDto>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      data,
    );
    return response;
  },

  getUserInfo: async (): Promise<UserInfoResponseDto> => {
    const response = await rootApiService.post<UserInfoResponseDto>(
      API_ENDPOINTS.AUTH.ME,
    );
    return response;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT,
    );
    return response;
  },

  changePassword: async (data: any): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data,
    );
    return response;
  },
};
