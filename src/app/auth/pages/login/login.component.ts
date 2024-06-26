import { DxFormModule } from 'devextreme-angular';
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Login } from '../../state/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DxFormModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: ''
  };

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  constructor(private store: Store, private router: Router) {}

  onLogin(e: any) {
    e.preventDefault();

    this.store.dispatch(new Login(
      this.loginForm.email,
      this.loginForm.password
    )).subscribe(() => {
      this.router.navigate(['/dashboard']);
    })
  }
}
