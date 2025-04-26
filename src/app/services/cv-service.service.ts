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

  getCVsByJobOffer(): Observable<CV[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<CV[]>(`${this.apiUrl}/job-offer/cvs`, {
      headers: this.getAuthHeaders(),
    });
  }

  downloadCV(cvId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/cv/${cvId}/download`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    });
  }

  uploadCV(file: File): Observable<CV> {
    const formData = new FormData();
    formData.append('resume', file);

    return this.http.post<CV>(`${this.apiUrl}/upload-parse-cv`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  loadCVs(): Observable<CV[]> {
    return this.http.get<CV[]>(`${this.apiUrl}/load-resumes`, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCV(cvId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-cv/${cvId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
