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
  token_type: string;
}
