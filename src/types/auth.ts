/**
 * TaskPulse Enterprise - Authentication Type Definitions
 */

export interface LoginCredentials {
  username: string; // OAuth2 form field (contains user email)
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user_id?: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}
