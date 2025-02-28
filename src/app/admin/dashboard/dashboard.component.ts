import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  // Logout method
  logout() {
    this.authService.logout(); // Call the logout method from your AuthService
    this.router.navigate(['/login']); // Navigate to the login page after logout
  }

  isSidebarClosed = false;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed; // Inverse l'état du sidebar
  }
}
