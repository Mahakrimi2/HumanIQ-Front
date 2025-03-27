import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyServiceService {
  private apiUrl = 'http://localhost:8082/api/company';

  constructor(private http: HttpClient) {}

  getCompany(): Observable<Company> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Company>(`${this.apiUrl}`, { headers: headers });
  }

  updateCompany(updatedCompany: Company): Observable<Company> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Company>(
      `${this.apiUrl}/edit`,
      updatedCompany,
      { headers }
    );
  }
}
