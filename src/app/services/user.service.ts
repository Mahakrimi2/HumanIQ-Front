import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api/rh';
  constructor(private http: HttpClient) {}

  addUser(user: User, id: number): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const body = { ...user };
    return this.http.post<User>(`${this.apiUrl}/register?id=${id}`, user, {
      headers,
    });
  }
  getAllUserscomm(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User[]>(`http://localhost:8082/api/users/all`, {
      headers,
    });
  }

  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User[]>(`${this.apiUrl}/all-users`, { headers });
  }
  getUserById(id: number): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User>(`${this.apiUrl}/getbyemail/${id}`, { headers });
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
      `http://localhost:8082/api/users/users/${userId}/uploadProfileImage?file`,
      formData,
      { headers, responseType: 'text' as 'json' }
    );
  }

  deleteProfileImage(userId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(
      `${this.apiUrl}/users/${userId}/deleteProfileImage`,
      { headers, responseType: 'text' as 'json' }
    );
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
    return this.http.get<User>(`http://localhost:8082/api/users/profile`, {
      headers,
    });
  }

  updateCurrentUserProfile(user: User): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<User>(
      `http://localhost:8082/api/users/users/profile`,
      user,
      {
        headers,
      }
    );
  }

  ChangePassword(request: ChangePasswordRequest): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<User>(
      `http://localhost:8082/api/users/users/change-password`,
      request,
      {
        headers,
      }
    );
  }

  getAllUsersWithRoles(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User[]>(`${this.apiUrl}/all-with-roles`, {
      headers,
    });
  }

  getCountOfUsersByRole(): Observable<{ [key: string]: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ [key: string]: number }>(
      `${this.apiUrl}/count-by-role`,
      { headers }
    );
  }

  getroles(): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<string[]>(`${this.apiUrl}/roles`, { headers });
  }
}
