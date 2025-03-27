import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-validate-account',
  templateUrl: './validate-account.component.html',
  styleUrls: ['./validate-account.component.css'],
})
export class ValidateAccountComponent {
  validationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  username: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.validationForm = this.fb.group({
      code: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Récupérer le paramètre d'email de l'URL
    this.route.queryParams.subscribe((params) => {
    this.validationForm.patchValue({ code: params['token'] || '' });
  });
  }

  onValidate() {
    if (this.validationForm.valid) {
      const validationData = this.validationForm.value;

      this.authService.validateAccount(validationData.code).subscribe({
        next: () => {
          this.successMessage = 'Compte activé avec succès !';
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = 'Erreur : ' + error.error;
          this.successMessage = '';
        },
      });
    }
  }
}
