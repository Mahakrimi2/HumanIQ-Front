import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatRoomService } from 'src/app/services/chat-room.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
})
export class ChatsComponent implements OnInit {
  selectedUserId: number | null = null;
  messages: any[] = [];
  newMessage: string = '';
  rooms: any[] = [];
  selectedRoomId: any = null;
  username: any;
  users: any[] = [];
  usersfilter: any[] = [];

  constructor(
    private chatService: ChatService,
    private chatRoomService: ChatRoomService,
    private userservice: UserService,
    public auth: AuthService
  ) {}
  ProfilImageUrl: any;
  user: any;
  SenderProfile: any;
  ShowUsers: boolean = true;
  ShowChat: boolean = false;

  ngOnInit() {
    this.username = this.auth.getUsername();

    this.userservice.getCurrentUserProfile().subscribe({
      next: (data) => {
        console.log(data);
        if (data && data.profileImagePath) {
          this.SenderProfile =
            'http://localhost:8082/api/rh/users/profileImage/' +
            data.profileImagePath;
          this.user = data;
        } else {
          this.SenderProfile = 'assets/img/anonyme.jpg';
          this.user = data;
        }
      },

      error: (err) => console.error('Failed to load user profile', err),
    });

    this.userservice.getAllUserscomm().subscribe((data: any[]) => {
      this.usersfilter = data.filter(
        (a: any) => a.username !== this.auth.getUsername()
      );
      this.usersfilter = this.usersfilter.map((user: any) => ({
        ...user,
        profileImageUrl:
          'http://localhost:8082/api/rh/users/profileImage/' +
          user.profileImagePath,
      }));
    });
    this.chatRoomService.getrooms(this.username).subscribe(
      (data) => {
        this.rooms = data.map((room: any) => {
          room.users = room.users.filter(
            (user: any) => user.username !== this.auth.getUsername()
          );
          return room;
        });
        console.log('Rooms:', this.rooms);
      },
      (error) => console.error('Erreur lors du chargement des rooms:', error)
    );
  }

  toggleChat() {
    this.ShowChat = !this.ShowChat;
    this.ShowUsers = !this.ShowUsers;
    this.selectedRoomId = null;
    this.selectedUserId = null;
    this.messages = [];
    this.getuserconnect();
  }
  close() {
    this.selectedRoomId = null;
    this.selectedUserId = null;
    this.messages = [];
    this.getuserconnect();
  }
  getuserconnect() {
    this.userservice.getCurrentUserProfile().subscribe({
      next: (data) => {
        console.log(data);
        if (data && data.profileImagePath) {
          this.SenderProfile =
            'http://localhost:8082/api/rh/users/profileImage/' +
            data.profileImagePath;
          this.user = data;
        } else {
          this.SenderProfile = 'assets/img/anonyme.jpg';
          this.user = data;
        }
      },
    });
  }
  getFirstInitial(fullname: string): string {
    return fullname?.charAt(0)?.toUpperCase() || '?';
  }

  getAvatarColor(fullname: string): string {
    const darkColors = [
      '#2c3e50', // Noir bleuté très foncé
      '#34495e', // Noir bleuté foncé
      '#2c3e50', // Bleu nuit
      '#1a237e', // Bleu indigo foncé
      '#0d47a1', // Bleu marine
      '#263238', // Gris anthracite
      '#212121', // Noir profond
      '#311b92', // Violet très foncé
    ];

    const charCode = fullname?.charCodeAt(0) || 0;
    return darkColors[charCode % darkColors.length];
  }
  isDefaultImage(profileImagePath: string): boolean {
    return !profileImagePath || profileImagePath.includes('anonyme');
  }

  selectRoom(roomId: any, user: any) {
    this.selectedRoomId = roomId;
    if (user && user.profileImagePath) {
      this.SenderProfile =
        'http://localhost:8082/api/rh/users/profileImage/' +
        user.profileImagePath;
      this.user = user;
    } else {
      this.SenderProfile = 'assets/img/anonyme.jpg';
      this.user = user;
    }
    this.chatService.getMessagesbyroom(this.selectedRoomId).subscribe(
      (messages: any[]) => {
        console.log('Messages:', messages);
        this.selectedUserId = user.id;
        this.messages = messages;
        this.updateUnreadMessageCount();
      },
      (error) => console.error('Erreur lors du chargement des messages:', error)
    );
  }
  updateUnreadMessageCount() {
    const currentCount = this.chatService.unreadMessageCount.value;
    if (currentCount > 0) {
      this.chatService.unreadMessageCount.next(currentCount - 1); // Decrease the unread count
    }
  }
  selectUser(user: any) {
    this.selectedUserId = user.id;
    if (user && user.profileImagePath) {
      this.SenderProfile =
        'http://localhost:8082/api/rh/users/profileImage/' +
        user.profileImagePath;
      this.user = user;
    } else {
      this.SenderProfile = 'assets/img/anonyme.jpg';
      this.user = user;
    }
    this.chatRoomService
      .createChatRoom(this.auth.getUsername(), this.selectedUserId!)
      .subscribe(
        (room) => {
          console.log('Chatroom créée ou existante:', room);
          this.selectedRoomId = room.id;
          this.ShowUsers = !this.ShowUsers;
          this.ShowChat = !this.ShowChat;
          this.getroomes();
          this.getMessages();
        },
        (error) =>
          console.error('Erreur lors de la création de la chatroom:', error)
      );
  }
  getroomes() {
    this.chatRoomService.getrooms(this.username).subscribe(
      (data) => {
        this.rooms = data.map((room: any) => {
          room.users = room.users.filter(
            (user: any) => user.username !== this.auth.getUsername()
          );
          return room;
        });

        console.log('Rooms:', this.rooms);
      },
      (error) => console.error('Erreur lors du chargement des rooms:', error)
    );
  }
  deletechat(id: any) {
    this.chatRoomService.deletechat(id).subscribe((data) => {
      this.selectedRoomId = null;
      this.selectedUserId = null;
      this.messages = [];
      this.getuserconnect();
      if (this.rooms.length > 0) {
        this.getroomes();
      }
    });
  }
  getMessages() {
    this.chatService.getMessagesbyroom(this.selectedRoomId).subscribe(
      (messages: any[]) => {
        console.log("Messages mis à jour depuis l'API:", messages);
        this.messages = messages;
        this.updateUnreadMessageCount();
      },
      (error) =>
        console.error('Erreur lors du rafraîchissement des messages:', error)
    );
  }
  sendMessage() {
    if (this.newMessage.trim() !== '' && this.selectedRoomId !== null) {
      this.chatService.sendMessage(
        this.selectedRoomId,
        this.selectedUserId!,
        this.newMessage
      );
      this.chatService.messages.subscribe((message: any) => {
        console.log('Message reçu via WebSocket:', message);
        this.chatService.getMessagesbyroom(this.selectedRoomId).subscribe(
          (messages: any[]) => {
            console.log("Messages mis à jour depuis l'API:", messages);
            this.messages = messages;
            this.updateUnreadMessageCount();
          },
          (error) =>
            console.error(
              'Erreur lors du rafraîchissement des messages:',
              error
            )
        );
      });
      this.newMessage = '';
    }
  }
}
