import type {
  LoginReq,
  RefreshTokenReq,
  RefreshTokenResponseDto,
  UserInfoResponseDto,
  UserLogInResponseDto,
} from "@/dto/auth.dto";
import { apiRequest } from "@/utils/api-client";
import { API_ENDPOINTS } from "./endpoint";

export const authService = {
  login: async (data: LoginReq): Promise<UserLogInResponseDto> => {
    const response = await apiRequest.post<UserLogInResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  refreshToken: async (
    data: RefreshTokenReq
  ): Promise<RefreshTokenResponseDto> => {
    const response = await apiRequest.post<RefreshTokenResponseDto>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      data
    );
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfoResponseDto> => {
    const response = await apiRequest.post<UserInfoResponseDto>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiRequest.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data;
  },

  changePassword: async (data: any): Promise<{ message: string }> => {
    const response = await apiRequest.post<{ message: string }>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },
};
