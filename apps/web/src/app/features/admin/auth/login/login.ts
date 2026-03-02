import { AuthService } from '@/app/core/services/auth';
import { ErrorHandlerService } from '@/app/core/services/error-handler';
import { IconsModule } from '@/app/shared/components/icons';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
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
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsModule],
  templateUrl: './login.html',
})
export class AdminLogin {
  serverError = '';

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private errorHandleService: ErrorHandlerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  handleLogin(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.showFirstControlError();
      return;
    }

    const username = this.loginForm.get('username')?.value?.trim() ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    const payload: LoginBody = { email: username, password };
    this.serverError = '';

    this.authService.login(payload).subscribe({
      next: () => {
        this.toastr.success('Login successful');
        this.router.navigate(['admin/dashboard']);
      },
      error: (err) => {
        const apiMessage = err.error?.error;
        const status = err.status ?? 0;
        const message = apiMessage?.trim() || this.getDefaultError(status);
        setTimeout(() => {
          this.serverError = message;
          this.cdr.detectChanges();
          this.errorHandleService.handleStatus(status, apiMessage);
        }, 0);
      },
    });
  }

  private getDefaultError(status: number): string {
    const messages: Record<number, string> = {
      400: 'Invalid request. Check your input.',
      401: 'Invalid credentials.',
      403: 'Access denied.',
      404: 'Not found.',
      500: 'Server error. Please try again.',
    };
    return messages[status] || 'Something went wrong.';
  }

  private showFirstControlError(): void {
    const username = this.loginForm.get('username');
    const password = this.loginForm.get('password');
    if (username?.invalid && username?.errors?.['required']) {
      this.toastr.error('Username is required');
      return;
    }
    if (password?.invalid && password?.errors?.['required']) {
      this.toastr.error('Password is required');
    }
  }
}
