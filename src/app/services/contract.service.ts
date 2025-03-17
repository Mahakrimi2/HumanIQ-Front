import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Contract } from '../models/contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = 'http://localhost:8082/api/rh';

  constructor(private http: HttpClient) {}
  createContract(contract: Contract, userId: number): Observable<Contract> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Contract>(
      `${this.apiUrl}/contract/${userId}`,
      contract,
      { headers: headers }
    );
  }

  getAllContracts(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/contracts`, { headers: headers });
  }
  getAllContractsbystatus(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/contractsbystatus`, {
      headers: headers,
    });
  }
  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/contract/${id}`);
  }
  updateContract(id: number, updatedContract: Contract): Observable<Contract> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Contract>(
      `${this.apiUrl}/contract/${id}`,
      updatedContract,
      { headers }
    );
  }
  deleteContract(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrl}/contract/${id}`, {
      headers: headers,
    });
  }
  archiveContrat(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrl}/contract/${id}/archive`, {
      headers,
    });
  }

  getArchivedContracts(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/contract/archived`, {
      headers: headers,
    });
  }
  restoreContrat(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<void>(
      `${this.apiUrl}/contract/${id}/restore`,
      {},
      { headers }
    );
  }

  getContratByUsername(username: string): Observable<Contract[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Contract[]>(
      `http://localhost:8082/api/employee/${username}/contracts`,
      { headers }
    );
  }

 
}
