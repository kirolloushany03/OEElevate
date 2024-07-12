import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { DxFormComponent, DxFormModule } from 'devextreme-angular';
import { Login, SignUp } from '../../state/auth.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    RouterModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  @ViewChild(DxFormComponent, { static: false }) formComponent?: DxFormComponent;
  signUpError$ = this.store.select(state => state.auth.signUpError);

  signUpForm = {
    username: '',
    company_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  getPassword() {
    return this.signUpForm.password;
  }

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  constructor(private store: Store, private router: Router) { }

  onSignUp(e: any) {
    e.preventDefault();
    const validationGroup = this.formComponent?.instance.validate();

    if (!validationGroup?.isValid)
      return;

    this.store.dispatch(new SignUp(this.signUpForm))
  }
}
