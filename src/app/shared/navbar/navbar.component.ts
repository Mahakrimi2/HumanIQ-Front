import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthModel } from 'src/app/models/auth.model';
import { Event } from 'src/app/models/event.model';
import { Holiday } from 'src/app/models/holiday.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { EventsService } from 'src/app/services/events.service';
import { HolidayService } from 'src/app/services/holiday.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userRole: string | null = null;
  pendingCount: number = 0;
  eventCount: number = 0;
  totalNotifications: number = 0;
  pendingRequests: Holiday[] = [];
  showNotifications: boolean = false;
  eventNotifications: Event[] = [];
  @Output() toggleSidebar = new EventEmitter<void>();
  currentUserId: number | undefined;

  toggle() {
    this.toggleSidebar.emit();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
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
    private userService: UserService,
    private chatService: ChatService,
    private holidayService: HolidayService,
    private eventService: EventsService
  ) {}

  ngOnInit(): any {
    const AuthModel = this.authService.getUsername();

    this.loadUserProfile();
    this.chatService.getUnreadMessagesCount().subscribe((count) => {
      this.unreadMessagesCount = count;
    });

    this.userRole = this.authService.getRole();
    console.log("Rôle de l'utilisateur:", this.userRole);

    this.loadPendingRequests();
    this.loadEvents();
  }

  unreadMessagesCount: number = 0;

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
  loadUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (data) => {
        console.log(data);
        if (data && data.profileImagePath) {
          this.ProfilImageUrl =
            'http://localhost:8082/api/rh/users/profileImage/' +
            data.profileImagePath;
          this.currentUserId = data.id;
          this.user = data;
        } else {
          this.ProfilImageUrl = 'assets/img/anonyme.jpg';
          this.user = data;
        }
      },
      error: (err) => console.error('Failed to load user profile', err),
    });
  }

  loadPendingRequests() {
    if (this.isRH || this.isManager) {
      this.holidayService.getAllHolidays().subscribe(
        (requests) => {
          this.pendingRequests = requests.filter(
            (request) => request.status === 'PENDING'
          );
          this.pendingCount = this.pendingRequests.length;
          this.updateTotalNotifications();
        },
        (error) => {
          console.error('Error loading pending requests:', error);
        }
      );
    }
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(
      (events: any[]) => {
        this.eventNotifications = events.filter(
          (event) => event.creator?.id !== this.currentUserId
        );
        this.eventCount = this.eventNotifications.length;
        this.updateTotalNotifications();
      },
      (error) => {
        console.error('Error loading events:', error);
      }
    );
  }

  private updateTotalNotifications() {
    this.totalNotifications = this.pendingCount + this.eventCount;
  }
}
