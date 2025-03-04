import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { NavbarComponent } from '../shared/navbar/navbar.component';

import { EmployeesListComponent } from './employees-list/employees-list.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { DepartmentComponent } from './department/department.component';
import { CalenderComponent } from './calender/calender.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PayrollComponent } from './payroll/payroll.component';
import { HttpClientModule } from '@angular/common/http';
import { ListContractsComponent } from './list-contracts/list-contracts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfilComponent } from '../shared/user-profil/user-profil.component';
import { ArchivedContractsComponent } from './archived-contracts/archived-contracts.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';


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
    UserProfilComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],

  exports: [CalenderComponent],
})
export class AdminModule {}
