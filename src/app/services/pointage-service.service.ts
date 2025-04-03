import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { pointage } from '../models/pointage.model';

@Injectable({
  providedIn: 'root',
})
export class PointageService {
  private apiUrl = 'http://localhost:8082/api/pointages';

  constructor(private http: HttpClient) {}

  createPointage(email: string, pointage: any): Observable<pointage> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('Token not found in local storage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post<pointage>(`${this.apiUrl}/create/${email}`, pointage, { headers })
      .pipe(catchError(this.handleError));
  }

  getPointagesByUser(username: string): Observable<pointage[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('Token not found in local storage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<pointage[]>(`${this.apiUrl}/${username}`, { headers })
      .pipe(catchError(this.handleError));
  }
  getPointagesByid(id: number): Observable<pointage> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('Token not found in local storage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<pointage>(`${this.apiUrl}/byid/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }
  getAllPointages(): Observable<pointage[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('Token not found in local storage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<pointage[]>(`${this.apiUrl}/all`, { headers }) 
      .pipe(catchError(this.handleError));
  }

  updatePointage(id: number, pointage: any): Observable<pointage> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('Token not found in local storage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .put<pointage>(`${this.apiUrl}/update/${id}`, pointage, { headers })
      .pipe(catchError(this.handleError));
  }

  deletePointage(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('Token not found in local storage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .delete<void>(`${this.apiUrl}/delete/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

   getHolidayStatus(): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<string[]>(`${this.apiUrl}/statuses`, { headers });
  }
}
