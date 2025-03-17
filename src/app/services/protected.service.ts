import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProtectedService {
  private apiUrl = 'http://localhost:8082/api/test';

  constructor(private http: HttpClient) {}

  testPrivate(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/private`);
  }
}
