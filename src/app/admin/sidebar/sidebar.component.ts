import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit{
  isSidebarClosed: any;
  @Input() isClosed = false;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.ROLE = this.authService.isrole
    console.log('====================================');
    console.log(this.ROLE);
    console.log('====================================');
  }
  ROLE:any
  logout() {
    this.authService.logout(); // Call the logout method from your AuthService
    this.router.navigate(['/login']); // Navigate to the login page after logout
  }
}
