import { Injectable } from '@angular/core';
import { CrudService } from '../../services/crud/crud.service';
import { LoginCredentials, SignUpCredentials } from '../../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private crud:CrudService) { }

  register(payload: SignUpCredentials) {
    return this.crud.create('/auth/register', payload);
  }

  login(payload: LoginCredentials) {
    return this.crud.create('/auth/login', payload);
  }

  getUserInfo() {
    return this.crud.read('/user');
  }
}
