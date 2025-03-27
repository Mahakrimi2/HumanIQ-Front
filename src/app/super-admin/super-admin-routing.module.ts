import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { EmployeesListAdminComponent } from './employees-list-admin/employees-list-admin.component';
import { LeaveRequestAdminComponent } from './leave-request-admin/leave-request-admin.component';
import { DepartmentAdminComponent } from './department-admin/department-admin.component';
import { ContractsListAdminComponent } from './contracts-list-admin/contracts-list-admin.component';
import { ContractsArchivedAdminComponent } from './contracts-archived-admin/contracts-archived-admin.component';
import { PointageListComponent } from '../admin/pointage-list/pointage-list.component';
import { PointageListAdminComponent } from './pointage-list-admin/pointage-list-admin.component';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { DashAdminComponent } from './dash-admin/dash-admin.component';
import { EventsComponent } from './events/events.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashAdminComponent },
      { path: 'employees-list', component: EmployeesListAdminComponent },
      { path: 'leave-request', component: LeaveRequestAdminComponent },
      { path: 'department', component: DepartmentAdminComponent },
      { path: 'list-contracts', component: ContractsListAdminComponent },
      { path: 'list-events', component: EventsComponent },
      {
        path: 'archived-contracts',
        component: ContractsArchivedAdminComponent,
      },
      { path: 'pointage-list', component: PointageListAdminComponent },
      { path: 'company', component: CompanyAdminComponent },
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
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
