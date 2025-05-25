import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class PayslipService {
  private apiUrl = 'http://localhost:8082/api/payslips';
  constructor(private http: HttpClient) {}
  getMyPayslips(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/my-payslips`, { headers });
  }

  downloadPayslip(id: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: 'blob',
      headers,
    });
  }

  downloadPayslipforRHAdmin(id: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/download/adminRh/${id}`, {
      responseType: 'blob',
      headers,
    });
 
   
  }
  deletePayslip(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getAllPayslips(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/all`, { headers });
  }

  getPayslipsByUserId(userId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, {
      headers,
    });
  }
}
