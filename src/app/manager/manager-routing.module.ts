import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { DashbaordManagaerComponent } from './dashbaord-managaer/dashbaord-managaer.component';
import { EventsManagerComponent } from './events-manager/events-manager.component';
const routes: Routes = [
  {
    path: "",
    children: [
      { path: "dashboard", component: DashbaordManagaerComponent },

      { path: "projects-list", component: ProjectsComponent },

      { path: "list-events", component: EventsManagerComponent },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule {}
