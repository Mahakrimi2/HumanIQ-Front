import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuard } from '../auth/Guard/auth_guard';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { DepartmentComponent } from './department/department.component';
import { CalenderComponent } from './calender/calender.component';
import { PayrollComponent } from './payroll/payroll.component';

import { ListContractsComponent } from './list-contracts/list-contracts.component';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { combineEventUis } from '@fullcalendar/core/internal';
import { ArchivedContractsComponent } from './archived-contracts/archived-contracts.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'list-employees', component: EmployeesListComponent },
      { path: 'leave-requests', component: LeaveRequestComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'calendar', component: CalenderComponent },
      { path: 'payroll', component: PayrollComponent },
  
      { path: 'list-contracts', component: ListContractsComponent },
      { path: 'user-profil', component: UserProfilComponent },
      { path: 'archived-contracts', component: ArchivedContractsComponent },
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
export class AdminRoutingModule {}
