import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Holiday } from '../models/holiday.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private apiUrl = 'http://localhost:8082/api/holiday';
  constructor(private http: HttpClient) {}

  createHolidayRequest(email: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}?email=${email}&file`, formData, {
      headers,responseType:'text'
    });
  }

  getAllHolidays(): Observable<Holiday[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Holiday[]>(this.apiUrl, { headers });
  }
  getHolidayStatus(): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<string[]>(`${this.apiUrl}/statuses`, { headers });
  }

  getHolidayById(id: number): Observable<Holiday> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Holiday>(`${this.apiUrl}/${id}`, { headers });
  }

  approveHoliday(id: number): Observable<Holiday> {
    return this.http.put<Holiday>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectHoliday(id: number): Observable<Holiday> {
    return this.http.put<Holiday>(`${this.apiUrl}/${id}/reject`, {});
  }

  deleteHoliday(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getHolidayTypes(): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<string[]>(`${this.apiUrl}/types`, { headers });
  }

  updateHolidayStatus(id: number, status: string): Observable<Holiday> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().set('status', status); // Ajouter le statut comme paramètre de requête
    return this.http.put<Holiday>(`${this.apiUrl}/${id}/status`, null, {
      headers,
      params,responseType:"text" as "json"
    });
  }

  getEmployeeHolidays(empUsername: String): Observable<Holiday[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Holiday[]>(`${this.apiUrl}/username/${empUsername}`, {
      headers,
    });
  }
}
