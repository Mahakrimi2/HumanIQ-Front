import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthGuard } from '../auth/Guard/auth_guard';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { DepartmentComponent } from './department/department.component';
import { CalenderComponent } from './calender/calender.component';
import { PayrollComponent } from './payroll/payroll.component';

import { ListContractsComponent } from './list-contracts/list-contracts.component';
import { UserProfilComponent } from '../shared/user-profil/user-profil.component';
import { combineEventUis } from '@fullcalendar/core/internal';
import { ArchivedContractsComponent } from './archived-contracts/archived-contracts.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { PointageListComponent } from './pointage-list/pointage-list.component';
import { PointagerhComponent } from './pointagerh/pointagerh.component';
import { DashbaordRhComponent } from './dashbaord-rh/dashbaord-rh.component';
import { EventsComponent } from './events/events.component';
import { OffreComponent } from './offre/offre.component';
import { CvComponent } from './cv/cv.component';
import { CompanyRHComponent } from './company-rh/company-rh.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashbaordRhComponent },

      { path: 'list-employees', component: EmployeesListComponent },
      { path: 'leave-requests', component: LeaveRequestComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'calendar', component: CalenderComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'pointage', component: PointagerhComponent },
      { path: 'list-events', component: EventsComponent },
      { path: 'list-contracts', component: ListContractsComponent },
      { path: 'list-offers', component: OffreComponent },
      { path: 'list-cv', component: CvComponent },
      { path: 'archived-contracts', component: ArchivedContractsComponent },
      { path: 'pointage-list', component: PointageListComponent },
      { path: 'DashRh', component: DashbaordRhComponent },
      { path: 'company', component:CompanyRHComponent },

      {
        path: '',
        redirectTo: 'DashRh',
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
