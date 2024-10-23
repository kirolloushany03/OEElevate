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
