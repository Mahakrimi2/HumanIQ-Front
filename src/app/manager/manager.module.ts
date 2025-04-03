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

@NgModule({
  declarations: [ProjectsComponent, DashbaordManagaerComponent, EventsManagerComponent, PointageManagerComponent, CalendarManagerComponent],
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
