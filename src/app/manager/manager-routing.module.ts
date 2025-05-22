import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { DashbaordManagaerComponent } from './dashbaord-managaer/dashbaord-managaer.component';
import { EventsManagerComponent } from './events-manager/events-manager.component';
import { PointageComponent } from '../employeeDash/pointage/pointage.component';
import { PointageManagerComponent } from './pointage-manager/pointage-manager.component';
import { CalendarManagerComponent } from './calendar-manager/calendar-manager.component';
import { CompanymanagerComponent } from './companymanager/companymanager.component';
import { LeaveRequestManagerComponent } from './leave-request-manager/leave-request-manager.component';
import { RequestListmanagerComponent } from './request-listmanager/request-listmanager.component';
import { ContractsmanagerComponent } from './contractsmanager/contractsmanager.component';
import { MyPayslipsComponent } from './my-payslips/my-payslips.component';
const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashbaordManagaerComponent },

      { path: 'projects-list', component: ProjectsComponent },
      { path: 'pointage', component: PointageManagerComponent },
      { path: 'calendar', component: CalendarManagerComponent },

      { path: 'list-events', component: EventsManagerComponent },
      { path: 'leave-request', component: LeaveRequestManagerComponent },
      { path: 'request-list', component: RequestListmanagerComponent },

      { path: 'contracts-manager', component: ContractsmanagerComponent },

      { path: 'company', component: CompanymanagerComponent },
      { path: 'my-payslips-manager', component: MyPayslipsComponent},
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
export class ManagerRoutingModule {}
