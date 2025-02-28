import { HttpClient } from '@angular/common/http';
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
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/department/${id}`);
  }

  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/department`, department);
  }

  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(
      `${this.apiUrl}/department/${id}`,
      department
    );
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/department/${id}`);
  }

  addEmployeeToDepartment(
    departmentId: number,
    employeeId: number
  ): Observable<Department> {
    return this.http.post<Department>(
      `${this.apiUrl}/department/${departmentId}/add-employee?employeeId=${employeeId}`,
      {}
    );
  }

  removeEmployeeFromDepartment(
    departmentId: number,
    employeeId: number
  ): Observable<Department> {
    return this.http.post<Department>(
      `${this.apiUrl}/department/${departmentId}/remove-employee?employeeId=${employeeId}`,
      {}
    );
  }

  getAvailableEmployees(): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}/department/available-employees`
    );
  }
}
