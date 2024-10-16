import { Injectable } from '@angular/core';
import { CrudService } from '../../services/crud/crud.service';
import { LoginCredentials, SignUpCredentials } from '../../models/auth';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private crud:CrudService) { }

  register(payload: SignUpCredentials) {
    return this.crud.create('/auth/register', payload);
  }

  login(payload: LoginCredentials) {
    return this.crud.create('/auth/login', payload) as Observable<{ access_token: string }>;
  }

  getUserInfo() {
    return this.crud.read('/user');
  }
}
