import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from '../services/auth.service';
import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
import { ValidateAccountComponent } from './validate-account/validate-account.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPwdComponent,
    ValidateAccountComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
