import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:8082/api/events';

  constructor(private http: HttpClient) {}

 

  createEvent(event: Event): Observable<Event> {
     const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Event>(this.apiUrl, event, {
      headers
    });
  }

  getEvents(): Observable<any[]> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });
    return this.http.get<Event[]>(this.apiUrl, {headers});
  }

  getEvent(id: number): Observable<Event> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });

    return this.http.get<Event>(`${this.apiUrl}/${id}`, {headers});
  }

  updateEvent(id: number, event: Event): Observable<Event> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });

    return this.http.put<Event>(`${this.apiUrl}/${id}`, event, {headers});
  }

  deleteEvent(id: number): Observable<void> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers});
  }

 

}
