import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalenderComponent } from 'src/app/admin/calender/calender.component';

import { ListContractsComponent } from 'src/app/admin/list-contracts/list-contracts.component';
import { PayrollComponent } from 'src/app/admin/payroll/payroll.component';
import { UserProfilComponent } from 'src/app/shared/user-profil/user-profil.component';
import { ContractsComponent } from './contracts/contracts.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { HolidayRequestComponent } from './holiday-request/holiday-request.component';
import { AddHolidayRequestComponent } from './add-holiday-request/add-holiday-request.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'calendar', component: CalenderComponent },
      { path: 'payroll', component: PayrollComponent },

      { path: 'my-contracts', component: ContractsComponent },
      { path: 'user-profil', component: UserProfilComponent },
      { path: 'holiday-request', component: HolidayRequestComponent },
      { path: 'add-holiday-request', component: AddHolidayRequestComponent },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
