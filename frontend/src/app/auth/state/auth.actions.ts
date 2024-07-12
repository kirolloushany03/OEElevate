import { LoginCredentials, SignUpCredentials } from "../../models/auth";

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: LoginCredentials) {}
}

export class GetUserInfo {
  static readonly type = '[Auth] GetUserInfo';
}

export class SignUp {
  static readonly type = '[Auth] SignUp';
  constructor(public payload: SignUpCredentials) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
