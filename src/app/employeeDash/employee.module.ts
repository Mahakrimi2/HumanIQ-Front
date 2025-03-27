import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { AdminRoutingModule } from 'src/app/admin/admin-routing.module';

import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractsComponent } from './contracts/contracts.component';
import { SharedModule } from '../shared/shared.module';
import { RouterLink } from '@angular/router';
import { HolidayRequestComponent } from './holiday-request/holiday-request.component';
import { AddHolidayRequestComponent } from './add-holiday-request/add-holiday-request.component';
import { PointageComponent } from './pointage/pointage.component';
import { CalenderComponent } from './calender/calender.component';
import { DashbaordEmpComponent } from './dashbaord-emp/dashbaord-emp.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';

@NgModule({
  declarations: [
    ContractsComponent,
    HolidayRequestComponent,
    AddHolidayRequestComponent,
    PointageComponent,
    CalenderComponent,
    DashbaordEmpComponent,
    MyProjectsComponent,

  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    CommonModule,
    FullCalendarModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class EmployeeModule {}
