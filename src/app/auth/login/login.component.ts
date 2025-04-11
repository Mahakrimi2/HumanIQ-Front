import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  userRole: string | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['/superAdmin/dashboard']);

  }

  get isSuperAdmin(): boolean {
    return this.userRole === 'ROLE_SUPERADMIN';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const authRequest: AuthRequest = {
        username: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      };

      console.log('Tentative de connexion pour:', authRequest.username);

      this.authService.login(authRequest).subscribe({
        next: (response) => {
          console.log('Connexion réussie');
          this.loading = false;
          localStorage.setItem('token', response.token);
          console.log('token:', response.token);
this.userRole = this.authService.getRole();


if (this.userRole === 'ROLE_SUPERADMIN') {
  this.router.navigate(['/superAdmin/dashboard']);
} else if (this.userRole === 'ROLE_MANAGER') {
  this.router.navigate(['/manager/dashboard']);
} else if (this.userRole === 'ROLE_RH') {
  this.router.navigate(['/admin/dashboard']);
  
} else if (this.userRole === 'ROLE_EMPLOYEE') {
  this.router.navigate(['/employee/dashboard']);
} else {
  // Redirection par défaut si le rôle n'est pas reconnu
  this.router.navigate(['/default/dashboard']);
}
       
 },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          this.loading = false;
          if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 400) {
            this.errorMessage = error.error || 'Données de connexion invalides';
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la connexion';
          }
        },
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
    }
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
  goToForgotPWD() {
    this.router.navigate(['/auth/forgetPassword']);
  }
}
