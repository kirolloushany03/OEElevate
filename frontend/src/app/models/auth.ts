export interface SignUpCredentials {
  username: string;
  is_employee: boolean;
  email: string;
  password: string;
  company_name?: string;
  invite_token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserInfo {
  username: string;
  email: string;
  is_employee: boolean;
  company_name: string;
  created_at: string;
}
