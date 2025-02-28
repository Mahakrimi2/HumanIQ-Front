import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { DepartmentComponent } from './department/department.component';
import { CalenderComponent } from './calender/calender.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PayrollComponent } from './payroll/payroll.component';
import { HttpClientModule } from '@angular/common/http';
import { ListContractsComponent } from './list-contracts/list-contracts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { ArchivedContractsComponent } from './archived-contracts/archived-contracts.component';

@NgModule({
  declarations: [
    DashboardComponent,
    EmployeesListComponent,
    SidebarComponent,
    NavbarComponent,
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
    SharedModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ],

  exports: [CalenderComponent],
})
export class AdminModule {}
