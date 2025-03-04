import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SidebarComponent, NavbarComponent],
  imports: [CommonModule, SharedRoutingModule, RouterModule],
  exports: [SidebarComponent, NavbarComponent],
})
export class SharedModule {}
