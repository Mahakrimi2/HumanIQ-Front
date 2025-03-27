import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ChatsComponent } from './chats/chats.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SidebarComponent, NavbarComponent, ChatsComponent],
  imports: [CommonModule, SharedRoutingModule, RouterModule,FormsModule],
  exports: [SidebarComponent, NavbarComponent],
})
export class SharedModule {}
