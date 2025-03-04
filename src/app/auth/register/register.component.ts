import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authservice: AuthService, // Injection correcte ici
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullname: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      position: ['', Validators.required],
      telNumber: ['', [Validators.required, Validators.pattern('[0-9]{8,15}')]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // this.authservice.register(this.registerForm.value).subscribe(
      //   {
      //     next: (response) => {
            
      //     console.log('Inscription réussie !');
      //     this.router.navigate(['/login']);
      //   },
      //   error: (err) => {
      //     this.errorMessage = err;
      //   },
      // });
    }
  }
}
