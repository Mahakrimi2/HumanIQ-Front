import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-pwd',
  templateUrl: './forget-pwd.component.html',
  styleUrls: ['./forget-pwd.component.css'],
})
export class ForgetPwdComponent {
  forgotPasswordForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitted = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  goToLogin() {
    this.router.navigate(['/auth/Login']);
  }

  onSubmit() {
    this.isSubmitted = true;
  
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.errorMessage = null;
    const email = this.forgotPasswordForm.value.username;

    this.authService.resetPassword(email).subscribe({
      next: () => {
        this.successMessage = 'A password reset link has been sent to your email';
        this.forgotPasswordForm.reset();
        this.isSubmitted = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'An error occurred';
      }
    });
  }
}