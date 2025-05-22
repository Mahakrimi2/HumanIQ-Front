import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ProjectsComponent } from './projects/projects.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DashbaordManagaerComponent } from './dashbaord-managaer/dashbaord-managaer.component';
import { EventsManagerComponent } from './events-manager/events-manager.component';
import { PointageManagerComponent } from './pointage-manager/pointage-manager.component';
import { CalendarManagerComponent } from './calendar-manager/calendar-manager.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CompanymanagerComponent } from './companymanager/companymanager.component';
import { LeaveRequestManagerComponent } from './leave-request-manager/leave-request-manager.component';
import { RequestListmanagerComponent } from './request-listmanager/request-listmanager.component';
import { ContractsmanagerComponent } from './contractsmanager/contractsmanager.component';
import { ArchivedContractMnagerComponent } from './archived-contract-mnager/archived-contract-mnager.component';
import { MyPayslipsComponent } from './my-payslips/my-payslips.component';

@NgModule({
  declarations: [ProjectsComponent, DashbaordManagaerComponent, EventsManagerComponent, PointageManagerComponent, CalendarManagerComponent, CompanymanagerComponent, LeaveRequestManagerComponent, RequestListmanagerComponent, ContractsmanagerComponent, ArchivedContractMnagerComponent, MyPayslipsComponent],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
     FullCalendarModule,
    RouterLink,
  ],
})
export class ManagerModule {}
