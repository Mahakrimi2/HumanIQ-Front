import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthModel } from 'src/app/models/auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  toggle() {
    this.toggleSidebar.emit();
  }

  ProfilImageUrl: any;
  user: any = {
    id: 0,
    fullname: '',
    username: '',
    address: '',
    position: '',
    telNumber: '',
  };
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): any {
    const AuthModel = this.authService.getUsername();
    return AuthModel;
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (data) => {
        console.log(data);
        if (data && data.profileImagePath) {
          this.ProfilImageUrl =
            'http://localhost:8082/api/rh/users/profileImage/' +
            data.profileImagePath;
          this.user = data;
        } else {
          this.ProfilImageUrl = 'assets/img/anonyme.jpg';
          this.user = data;
        }
      },

      error: (err) => console.error('Failed to load user profile', err),
    });
  }
}
