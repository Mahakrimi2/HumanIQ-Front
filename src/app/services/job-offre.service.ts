import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JobOffer } from '../models/JobOffer.model';

@Injectable({
  providedIn: 'root',
})
export class JobOffreService {
  private apiUrl = 'http://localhost:8082/api/rh';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<JobOffer>(`${this.apiUrl}/offre`, jobOffer, {
      headers,
    });
  }

  getAllActiveJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/offres`, {
      headers: this.getAuthHeaders(),
    });
  }

  getJobOfferById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateJobOffer(id: number, jobOffer: JobOffer): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.apiUrl}/${id}`, jobOffer, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteJobOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getContratctsTypes(): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<string[]>(`${this.apiUrl}/Contractstypes`, {
      headers,
    });
  }
}