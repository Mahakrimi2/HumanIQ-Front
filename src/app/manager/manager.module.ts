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

@NgModule({
  declarations: [ProjectsComponent, DashbaordManagaerComponent, EventsManagerComponent],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class ManagerModule {}
