import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },  
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'forgetPassword', component: ForgetPwdComponent },
    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
