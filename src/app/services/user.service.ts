import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api/rh';
  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<User>(`${this.apiUrl}/user`, user, { headers });
  }

  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }
  getUserById(id: number): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User>(`${this.apiUrl}/user/${id}`, { headers });
  }
  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`, { headers });
  }
  updateUser(id: number, updatedUser: User): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<User>(`${this.apiUrl}/user/${id}`, updatedUser, {
      headers,
    });
  }

  uploadProfileImage(userId: number, file: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      `${this.apiUrl}/users/${userId}/uploadProfileImage?file`,
      formData,
      { headers ,responseType:"text" as "json"}
    );
  }

  deleteProfileImage(userId: number) {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });
    return this.http.delete(`${this.apiUrl}/users/${userId}/deleteProfileImage`, { headers,responseType: "text" as "json"})
  }
  getProfileImage(filename: string): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/users/profileImage/${filename}`, {
      headers: headers,
      responseType: 'blob',
    });
  }

  getCurrentUserProfile(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User>(`${this.apiUrl}/users/profile`, { headers });
  }

  updateCurrentUserProfile(user: User): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<User>(`${this.apiUrl}/users/profile`, user, {
      headers,
    });
  }
}
