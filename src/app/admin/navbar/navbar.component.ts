import { Component, EventEmitter, Output } from '@angular/core';
import { AuthModel } from 'src/app/models/auth.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  toggle() {
    this.toggleSidebar.emit(); 
  }

  authmodel!: AuthModel;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe(
      (data) => {
        this.authmodel = data;
      },
      (error) => {
        // Display user-friendly error message
        alert('Failed to load user information. Please try again later.');
        console.error('Error:', error);
      }
    );
  }
}
