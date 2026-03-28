export interface LoginReq {
  username: string;
  password: string;
}

export interface RefreshTokenReq {
  refreshToken: string;
}

export interface RoleDto {
  id: string;
  name: string;
  code: string;
  permissions?: any[];
}

export interface EmployeeDto {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: any;
}

export interface UserSessionDto {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  lastLogin?: string | Date;
  roles: RoleDto[];
  employee?: EmployeeDto;
  permissions?: string[];
}

export interface UserLogInResponseDto {
  user: UserSessionDto;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  message?: string;
}

export interface UserInfoResponseDto {
  user: UserSessionDto;
  message?: string;
}
