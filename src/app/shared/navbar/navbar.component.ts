import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthModel } from 'src/app/models/auth.model';
import { Event } from 'src/app/models/event.model';
import { Holiday } from 'src/app/models/holiday.model';

import { Notification } from 'src/app/models/Notification.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { EventsService } from 'src/app/services/events.service';
import { HolidayService } from 'src/app/services/holiday.service';
import { NotificationServiceService } from 'src/app/services/notification-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userRole: string | null = null;
  pendingCount: number = 0;
  eventCount: number = 0;
  isOnline: boolean = navigator.onLine;
  private onlineStatusCheck: any;
  totalNotifications: number = 0;
  pendingRequests: Holiday[] = [];
  showNotifications: boolean = false;
  eventNotifications: Event[] = [];
  notifications: Notification[] = [];
  unreadNotificationsCount: number = 0;
  allNotifications: any[] = [];
  upcomingEvents: Event[] = [];
  showAllPending = false;
  showAllEvents = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  currentUserId: number | undefined;
  toggle() {
    this.toggleSidebar.emit();
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.unreadNotificationsCount > 0) {
      this.markNotificationsAsRead();
    }
  }

  toggleShowAllEvents() {
    this.showAllEvents = !this.showAllEvents;
  }

  toggleShowAllPending() {
    this.showAllPending = !this.showAllPending;
  }

  showAllNotifications: boolean = false;

  toggleShowAllNotifications() {
    this.showAllNotifications = !this.showAllNotifications;
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
    private eventService: EventsService,
    private notificationService: NotificationServiceService
  ) {}

  ngOnInit(): any {
    const AuthModel = this.authService.getUsername();

    this.loadUserProfile();
    this.chatService.getUnreadMessagesCount().subscribe((count) => {
      this.unreadMessagesCount = count;
    });

    this.userRole = this.authService.getRole();
    console.log("Rôle de l'utilisateur:", this.userRole);
    this.loadNotificationsAndRequests();

    this.buildUnifiedNotificationList();
    this.setupOnlineStatusListener();
  }

  ngOnDestroy(): void {
    // Nettoyage
    if (this.onlineStatusCheck) {
      clearInterval(this.onlineStatusCheck);
    }
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }

  private buildUnifiedNotificationList(): void {
    this.allNotifications = [
      ...this.notifications.map((n) => ({
        type: 'notification',
        data: n,
        timestamp: new Date(n.createdAt),
      })),
      ...this.pendingRequests.map((p) => ({
        type: 'holiday',
        data: p,
        timestamp: new Date(p.startDate),
      })),
      ...this.upcomingEvents.map((e) => ({
        type: 'event',
        data: e,
        timestamp: e.startDateTime,
      })),
    ];

    // Tri par date (les plus récentes en premier)
    this.allNotifications.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Met à jour le compteur total
  private updateTotalNotifications(): void {
    this.totalNotifications =
      this.unreadNotificationsCount + this.pendingCount + this.eventCount;
  }

  markNotificationsAsRead(): void {
    const unreadIds = this.notifications
      .filter((n) => !n.isRead)
      .map((n) => n.id);

    if (unreadIds.length > 0) {
      this.notificationService.markAsRead(unreadIds).subscribe({
        next: () => {
          this.notifications.forEach((n) => {
            if (unreadIds.includes(n.id)) n.isRead = true;
          });
          this.unreadNotificationsCount = 0;
          this.updateTotalNotifications();
        },
        error: (err) =>
          console.error('Error marking notifications as read', err),
      });
    }
  }

  private setupOnlineStatusListener(): void {
    // Écoute des événements navigateur
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    // Vérification périodique (optionnelle)
    this.onlineStatusCheck = setInterval(() => {
      this.isOnline = navigator.onLine;
    }, 5000);
  }
  private updateOnlineStatus = (): void => {
    this.isOnline = navigator.onLine;
    // Option : afficher une notification
    if (this.isOnline) {
      console.log('Vous êtes maintenant en ligne');
    } else {
      console.warn('Vous êtes hors ligne');
    }
  };

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

  // loadPendingRequests() {
  //   if (this.isRH || this.isSuperAdmin) {
  //     this.holidayService.getAllHolidays().subscribe(
  //       (requests) => {
  //         this.pendingRequests = requests.filter(
  //           (request) => request.status === 'PENDING'
  //         );
  //         this.pendingCount = this.pendingRequests.length;
  //         this.updateTotalNotifications();
  //       },
  //       (error) => {
  //         console.error('Error loading pending requests:', error);
  //       }
  //     );
  //   }
  // }
  loadNotificationsAndRequests(): void {
    // 1. Notifications
    this.notificationService.getNotifications().subscribe({
      next: (notifications: Notification[]) => {
        this.notifications = notifications;
        console.log('====================================');
        console.log('notification:', notifications);
        console.log('====================================');
        this.unreadNotificationsCount = notifications.filter(
          (n) => !n.isRead
        ).length;

        if (this.isRH || this.isSuperAdmin) {
          this.holidayService.getAllHolidays().subscribe({
            next: (requests) => {
              this.pendingRequests = requests.filter(
                (r) => r.status === 'PENDING'
              );
              this.pendingCount = this.pendingRequests.length;
              this.updateTotalNotifications(); // met à jour totalNotifications
            },
            error: (err) => {
              console.error(
                'Erreur lors du chargement des demandes en attente:',
                err
              );
            },
          });
        } else {
          // Si pas RH ou SuperAdmin, on met juste à jour les notifs
          this.updateTotalNotifications();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications:', err);
      },
    });
  }

  // Ajoutez ces méthodes
  markAsReadAndRemove(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        // Supprime la notification de la liste
        this.notifications = this.notifications.filter(
          (n) => n.id !== notificationId
        );
        this.unreadNotificationsCount = this.notifications.filter(
          (n) => !n.isRead
        ).length;
        this.updateTotalNotifications();
        this.buildUnifiedNotificationList();
      },
      error: (err) => console.error('Error marking notification as read', err),
    });
  }

  removeNotification(index: number, type: string): void {
    if (type === 'notification') {
      this.notifications.splice(index, 1);
      this.unreadNotificationsCount = this.notifications.filter(
        (n) => !n.isRead
      ).length;
    } else if (type === 'holiday') {
      this.pendingRequests.splice(index, 1);
      this.pendingCount = this.pendingRequests.length;
    } else if (type === 'event') {
      this.eventNotifications.splice(index, 1);
      this.eventCount = this.eventNotifications.length;
    }
    this.updateTotalNotifications();
    this.buildUnifiedNotificationList();
  }
}
