import { DxFormComponent, DxFormModule } from 'devextreme-angular';
import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetUserInfo, Login } from '../../state/auth.actions';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'oee-login',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('formComponent') formComponent?: DxFormComponent;

  loginForm = {
    email: '',
    password: ''
  };

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  loginError$ = this.store.select(state => state.auth.loginError);

  constructor(private store: Store, private router: Router) {}

  onLogin(e: Event) {
    e.preventDefault();

    this.store.dispatch(new Login(this.loginForm)).subscribe(() => {
      this.store.dispatch(new GetUserInfo());
      this.router.navigate(['/dashboard']);
    })
  }
}
