export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  error?: string;
}
