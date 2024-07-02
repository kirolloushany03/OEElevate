import { DxFormComponent, DxFormModule } from 'devextreme-angular';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Login } from '../../state/auth.actions';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
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

  onLogin(e: any) {
    e.preventDefault();

    this.store.dispatch(new Login(this.loginForm)).subscribe(() => {
      this.router.navigate(['/dashboard']);
    })
  }
}
