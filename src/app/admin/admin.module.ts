import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';


import { EmployeesListComponent } from './employees-list/employees-list.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { DepartmentComponent } from './department/department.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PayrollComponent } from './payroll/payroll.component';
import { HttpClientModule } from '@angular/common/http';
import { ListContractsComponent } from './list-contracts/list-contracts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfilComponent } from '../shared/user-profil/user-profil.component';
import { ArchivedContractsComponent } from './archived-contracts/archived-contracts.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { PointageListComponent } from './pointage-list/pointage-list.component';
import { CalenderComponent } from './calender/calender.component';
import { PointagerhComponent } from './pointagerh/pointagerh.component';
import { DashbaordRhComponent } from './dashbaord-rh/dashbaord-rh.component';
import { EventsComponent } from './events/events.component';
import { OffreComponent } from './offre/offre.component';
import { CvComponent } from './cv/cv.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CompanyRHComponent } from './company-rh/company-rh.component';



@NgModule({
  declarations: [
    DashboardComponent,
    EmployeesListComponent,
    LeaveRequestComponent,
    DepartmentComponent,
    CalenderComponent,
    PayrollComponent,
    ListContractsComponent,
    ArchivedContractsComponent,
    CompanyRHComponent,
    PointageListComponent,
    PointagerhComponent,
    DashbaordRhComponent,
    EventsComponent,
    OffreComponent,
    CvComponent,
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    NgbPaginationModule,
  ],

  exports: [SidebarComponent,NavbarComponent],
})
export class AdminModule {}
