import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Holiday } from '../models/holiday.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private apiUrl = 'http://localhost:8082/api/holiday';
  constructor(private http: HttpClient) {}

  createHolidayRequest(
    holiday: Holiday,
    certificateFile: File
  ): Observable<Holiday> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    formData.append(
      'holiday',
      new Blob([JSON.stringify(holiday)], { type: 'application/json' })
    );
    if (certificateFile) {
      formData.append('certificate', certificateFile);
    }

    return this.http.post<Holiday>(this.apiUrl, formData, { headers });
  }

  getAllHolidays(): Observable<Holiday[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Holiday[]>(this.apiUrl, { headers });
  }

  getHolidayById(id: number): Observable<Holiday> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Holiday>(`${this.apiUrl}/${id}`, { headers });
  }

  approveHoliday(id: number, approvedBy: string): Observable<Holiday> {
    return this.http.put<Holiday>(`${this.apiUrl}/${id}/approve`, {
      approvedBy,
    });
  }

  rejectHoliday(id: number, rejectedBy: string): Observable<Holiday> {
    return this.http.put<Holiday>(`${this.apiUrl}/${id}/reject`, {
      rejectedBy,
    });
  }

  deleteHoliday(id: number): Observable<void> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{headers});
  }

  getHolidayTypes(): Observable<string[]> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
       Authorization: `Bearer ${token}`,
     });
    return this.http.get<string[]>(`${this.apiUrl}/types`,{headers});
  }
}
