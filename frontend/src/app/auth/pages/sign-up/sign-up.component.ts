import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { DxFormComponent, DxFormModule } from 'devextreme-angular';
import { SignUp } from '../../state/auth.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'oee-sign-up',
  standalone: true,
  imports: [CommonModule, DxFormModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit, AfterViewInit {
  @ViewChild(DxFormComponent, { static: false })
  formComponent?: DxFormComponent;
  signUpError$ = this.store.select((state) => state.auth.signUpError);

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {}

  signUpForm = {
    username: '',
    company_name: '',
    email: '',
    password: '',
    confirm_password: '',
    is_employee: false,
    invite_token: '',
  };

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams['token']) {
      this.signUpForm = {
        ...this.signUpForm,
        is_employee: true,
        invite_token: this.activatedRoute.snapshot.queryParams['token'],
      };
    }
  }

  ngAfterViewInit(): void {
    if (this.signUpForm.is_employee) {
      this.formComponent?.instance.itemOption('is_employee', 'disabled', true);
      this.formComponent?.instance.itemOption('invite_token', 'disabled', true);
      this.formComponent?.instance.repaint();
    }
  }

  getPassword() {
    return this.signUpForm.password;
  }

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  onSignUp(e: Event) {
    e.preventDefault();
    const validationGroup = this.formComponent?.instance.validate();

    if (!validationGroup?.isValid) return;

    const { invite_token, company_name, ...main_data } = this.signUpForm;

    const payload = main_data.is_employee
      ? { ...main_data, invite_token, company_name: 'randomCompany' }
      : { ...main_data, company_name };

    this.store.dispatch(new SignUp(payload));
  }
}
