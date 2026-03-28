interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user_data",
};

class TokenCache {
  private cache: TokenData = {
    accessToken: null,
    refreshToken: null,
    user: null,
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      this.cache.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      this.cache.refreshToken = localStorage.getItem(
        STORAGE_KEYS.REFRESH_TOKEN
      );

      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      this.cache.user = userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      this.clear();
    }
  }

  setAccessToken(token: string): void {
    this.cache.accessToken = token;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return this.cache.accessToken;
  }

  setRefreshToken(token: string): void {
    this.cache.refreshToken = token;
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.cache.refreshToken;
  }

  setUser(user: any): void {
    this.cache.user = user;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): any | null {
    return this.cache.user;
  }

  setAuthData(accessToken: string, refreshToken: string, user: any): void {
    try {
      this.cache.accessToken = accessToken;
      this.cache.refreshToken = refreshToken;
      this.cache.user = user;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      return;
    }
  }

  clear(): void {
    this.cache.accessToken = null;
    this.cache.refreshToken = null;
    this.cache.user = null;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  isAuthenticated(): boolean {
    return !!this.cache.accessToken;
  }

  hasRefreshToken(): boolean {
    return !!this.cache.refreshToken;
  }
}

export const tokenCache = new TokenCache();
export default tokenCache;
