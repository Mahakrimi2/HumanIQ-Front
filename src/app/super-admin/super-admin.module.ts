import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { EmployeesListAdminComponent } from './employees-list-admin/employees-list-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LeaveRequestAdminComponent } from './leave-request-admin/leave-request-admin.component';
import { DepartmentAdminComponent } from './department-admin/department-admin.component';
import { ContractsListAdminComponent } from './contracts-list-admin/contracts-list-admin.component';
import { ContractsArchivedAdminComponent } from './contracts-archived-admin/contracts-archived-admin.component';
import { PointageListAdminComponent } from './pointage-list-admin/pointage-list-admin.component';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { DashAdminComponent } from './dash-admin/dash-admin.component';
import { EventsComponent } from './events/events.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PayslipComponent } from './payslip/payslip.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    EmployeesListAdminComponent,
    LeaveRequestAdminComponent,
    DepartmentAdminComponent,
    ContractsListAdminComponent,
    ContractsArchivedAdminComponent,
    PointageListAdminComponent,
    CompanyAdminComponent,
    DashAdminComponent,
    EventsComponent,
    PayslipComponent
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
        HttpClientModule,
        FormsModule,
        FullCalendarModule,
        NgbModule,
    ReactiveFormsModule,
        SharedModule
    
  ]
})
export class SuperAdminModule { }
