import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../models/department.model';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8082/api/rh';
  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Department[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Department[]>(`${this.apiUrl}/departments`, {
      headers,
    });
  }

  getDepartmentById(id: number): Observable<Department> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Department>(`${this.apiUrl}/department/${id}`, {
      headers,
    });
  }

  createDepartment(department: Department, id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(
      `${this.apiUrl}/departments/${id}/${department}`,
      {},
      {
        headers,
      }
    );
  }

  updateDepartment(
    id: number,
    department: any,
    iduser: number
  ): Observable<Department> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Department>(
      `${this.apiUrl}/departments/${id}?department=${department}&iduser=${iduser},`,
      {},
      { headers }
    );
  }

  deleteDepartment(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrl}/department/${id}`, {
      headers,
    });
  }

  addEmployeeToDepartment(
    departmentId: number,
    employeeId: number
  ): Observable<Department> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Department>(
      `${this.apiUrl}/department/${departmentId}/add-employee?employeeId=${employeeId}`,
      {},
      { headers }
    );
  }

  removeEmployeeFromDepartment(
    departmentId: number,
    employeeId: number
  ): Observable<Department> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Department>(
      `${this.apiUrl}/department/${departmentId}/remove-employee?employeeId=${employeeId}`,
      {},
      { headers }
    );
  }

  getAvailableEmployees(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User[]>(
      `${this.apiUrl}/department/available-employees`,
      { headers }
    );
  }

  getDepartmentNames(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/department/names`, {
      headers,
    });
  }
  getAvailableHeads(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User[]>(`${this.apiUrl}/department/available-heads`, {
      headers,
    });
  }

  getDepartmentByName(departmentName: string): Observable<Department> {
    const url = `${this.apiUrl}/department/name/${departmentName}`;
    return this.http.get<Department>(url);
  }
}
