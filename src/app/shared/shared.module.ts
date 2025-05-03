import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ChatsComponent } from './chats/chats.component';

import { FormsModule } from '@angular/forms';
import { UserProfilComponent } from './user-profil/user-profil.component';


@NgModule({
  declarations: [SidebarComponent, NavbarComponent,UserProfilComponent, ChatsComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    RouterModule,
    FormsModule

    
  ],
  exports: [SidebarComponent, NavbarComponent],
})
export class SharedModule {}
