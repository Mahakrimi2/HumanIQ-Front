import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ListContractsComponent } from 'src/app/admin/list-contracts/list-contracts.component';
import { PayrollComponent } from 'src/app/admin/payroll/payroll.component';
import { UserProfilComponent } from 'src/app/shared/user-profil/user-profil.component';
import { ContractsComponent } from './contracts/contracts.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { HolidayRequestComponent } from './holiday-request/holiday-request.component';
import { AddHolidayRequestComponent } from './add-holiday-request/add-holiday-request.component';
import { PointageComponent } from './pointage/pointage.component';
import { CalenderComponent } from './calender/calender.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { DashbaordEmpComponent } from './dashbaord-emp/dashbaord-emp.component';
import { CompanyComponent } from './company/company.component';
import { PayslipComponent } from '../super-admin/payslip/payslip.component';
import { PayslipListComponent } from './payslip-list/payslip-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashbaordEmpComponent },

  

      { path: 'my-contracts', component: ContractsComponent },

      { path: 'holiday-request', component: HolidayRequestComponent },
      { path: 'add-holiday-request', component: AddHolidayRequestComponent },
      { path: 'emp-pointage', component: PointageComponent },
      { path: 'calender', component: CalenderComponent },
      { path: 'my-projects', component: MyProjectsComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'my-payslips', component: PayslipListComponent },
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
