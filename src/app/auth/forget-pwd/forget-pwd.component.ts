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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/Login']);
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const username = this.forgotPasswordForm.value.username;

    this.authService.resetPassword(username).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Échec de la réinitialisation du mot de passe.';
        this.successMessage = null;
      },
    });
  }
}
