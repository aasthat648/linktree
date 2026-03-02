import { AuthService } from '@/app/core/services/auth';
import { ErrorHandlerService } from '@/app/core/services/error-handler';
import { ValidationToastService } from '@/app/core/services/validation-toast';
import { IconsModule } from '@/app/shared/components/icons';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginBody } from '@linktree/validation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, CommonModule, IconsModule],
  templateUrl: './login.html',
})
export class AdminLogin {
  isLoading = false;

  constructor(
    private toastr: ToastrService,
    private validator: ValidationToastService,
    private authService: AuthService,
    private errorHandleService: ErrorHandlerService,
    private router: Router,
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
  });

  handleLogin() {
    if (!this.validator.validateLogin(this.loginForm)) return;

    const data = this.loginForm.getRawValue() as LoginBody;
    this.isLoading = true;

    this.authService.login(data).subscribe({
      next: () => {
        this.toastr.success('Admin login successful');
        this.router.navigate(['dashboard/links']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        const errorMessage = this.errorHandleService.handleStatus(err.status);
        this.toastr.error(errorMessage);
      },
    });
  }
}
