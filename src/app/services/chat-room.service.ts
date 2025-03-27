import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private baseUrl = 'http://localhost:8082/api/chatroom'; // URL de votre backend

  constructor(private http: HttpClient) {}

  createChatRoom(user1Id: any, user2Id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.post(
      `${this.baseUrl}/create?user1Id=${user1Id}&user2Id=${user2Id}`,
      {},
      { headers }
    );
  }

  sendMessage(
    chatRoomId: number,
    senderId: any,
    content: string
  ): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.post(
      `${this.baseUrl}/${chatRoomId}/messages?senderId=${senderId}&content=${content}`,
      {},
      { headers, responseType: 'text' }
    );
  }

  getMessages(chatRoomId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<any[]>(`${this.baseUrl}/${chatRoomId}/messages`, {
      headers,
    });
  }
  deletechat(chatRoomId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.delete<any>(`${this.baseUrl}/${chatRoomId}/delete`, {
      headers,
      responseType: 'text' as 'json',
    });
  }
  getrooms(userid: any): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<any[]>(`${this.baseUrl}/${userid}/rooms`, {
      headers,
      responseType: 'json',
    });
  }
  getAllUsersByChatroom(userid: any): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http.get<any[]>(
      `${this.baseUrl}/${userid}/getAllUsersByChatroom`,
      { headers, responseType: 'json' }
    );
  }
}
