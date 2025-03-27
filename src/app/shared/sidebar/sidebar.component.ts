import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  userRole: string | null = null;

  isSidebarClosed: any;
  @Input() isClosed = false;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    // this.ROLE = this.authService.isrole;
    // console.log('====================================');
    // console.log(this.ROLE);
    // console.log('====================================');
    this.userRole = this.authService.getRole(); // Récupérer le rôle de l'utilisateur
    console.log("Rôle de l'utilisateur:", this.userRole);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isEmployee(): boolean {
    return this.userRole === 'ROLE_EMPLOYEE';
  }

  get isRH(): boolean {
    return this.userRole === 'ROLE_RH';
  }

  get isManager(): boolean {
    return this.userRole === 'ROLE_MANAGER';
  }

  get isSuperAdmin(): boolean {
    return this.userRole === 'ROLE_SUPERADMIN';
  }
}
