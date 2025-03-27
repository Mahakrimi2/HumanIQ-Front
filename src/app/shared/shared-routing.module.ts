import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesListAdminComponent } from '../super-admin/employees-list-admin/employees-list-admin.component';
import { ChatsComponent } from './chats/chats.component';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { LeaveRequestComponent } from '../admin/leave-request/leave-request.component';
const routes: Routes = [
  { path: 'chat', component: ChatsComponent },
  { path: 'user-profil', component: UserProfilComponent },
  { path: 'leave-requests', component: LeaveRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
