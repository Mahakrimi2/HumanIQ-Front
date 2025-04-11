import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client;
  public messages: Subject<any> = new Subject<any>();
  public unreadMessageCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(0); // Nombre de messages non lus

  constructor(private auth: AuthService, private http: HttpClient) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8082/ws'),
      connectHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.stompClient.subscribe('/topic/messages', (message: any) => {
        console.log(message);
        const newMessage = JSON.parse(message.body);
        this.messages.next(newMessage);

        if (
          newMessage.senderId !== this.auth.getUsername() &&
          !newMessage.read
        ) {
          const currentCount = this.unreadMessageCount.value;
          this.unreadMessageCount.next(currentCount + 1);
        }
      });
    };

    this.stompClient.activate();
  }

  getUnreadMessagesCount(): Observable<number> {
    return this.unreadMessageCount.asObservable();
  }

  getMessages(senderId: any, receiverId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<any[]>(
      `http://localhost:8082/messages/${senderId}/${receiverId}`,
      { headers }
    );
  }

  getMessagesbyroom(roomId: any): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<any[]>(`http://localhost:8082/messages/${roomId}`, {
      headers,
    });
  }

  sendMessage(chatroomId: number, receiverId: number, content: string) {
    const message = {
      senderId: this.auth.getUsername(),
      receiverId: receiverId,
      chatroomId: chatroomId,
      content: content,
    };
    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(message),
    });
  }
}
