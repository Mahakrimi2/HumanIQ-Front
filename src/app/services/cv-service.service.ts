import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CV } from '../models/CV.model';

@Injectable({
  providedIn: 'root',
})
export class CvServiceService {
  private apiUrl = 'http://localhost:8082/api/rh';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  uploadCV( file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/uploadCV`, formData, {
      headers: this.getAuthHeaders(),
      reportProgress: true,
      observe: 'events',
    });
  }

  getCVsByJobOffer(): Observable<CV[]> {
       const token = localStorage.getItem('token');
       const headers = new HttpHeaders({
         Authorization: `Bearer ${token}`,
       });
    return this.http.get<CV[]>(`${this.apiUrl}/job-offer/cvs`, {
      headers,
    });
  }

  downloadCV(cvId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/cv/${cvId}/download`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    });
  }
}
