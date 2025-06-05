import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Notification } from 'src/app/models/Notification.model';
@Injectable({
  providedIn: 'root',
})
export class NotificationServiceService {
  private apiUrl = 'http://localhost:8082/api/notifications';
  
  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
    return this.http.get<Notification[]>(this.apiUrl,{headers});
  }

  markAsRead(notificationId: any): Observable<void> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });
    return this.http.post<void>(`${this.apiUrl}/${notificationId}/read`, {}, { headers });
  }
}

