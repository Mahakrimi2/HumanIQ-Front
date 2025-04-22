import { Injectable, OnInit } from '@angular/core';
import { Project } from '../models/project.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectServiceService {
  private apiUrl = 'http://localhost:8082/api/manager';
  projects: Project[] = [];
  users: User[] = [];
  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Project[]>(`${this.apiUrl}`, { headers });
  }

  getProjectById(id: number): Observable<Project> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Project>(`${this.apiUrl}/${id}`, { headers });
  }

  createProject(
    project: Project,
    projectManagerId: number,
    employeeIds: number[]
  ): Observable<Project> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const employeeIdsString = employeeIds.join(',');

    const params = new HttpParams()
      .set('projectManagerId', projectManagerId.toString())
      .set('employeeIds', employeeIdsString);

    const body = project;

    return this.http
      .post<Project>(`${this.apiUrl}`, body, { headers, params })
      .pipe(
        catchError((error) => {
          console.error('Error creating project:', error);
          throw error;
        })
      );
  }
  updateProject(id: number, project: Project): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .put<any>(`${this.apiUrl}/update/${id}`, project, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating project:', error);
          throw error;
        })
      );
  }

  deleteProject(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getProjectsByStatus(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/status`, { headers });
  }

  getProjectsByPriority(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/priority`, { headers });
  }

  getProjectsByEmployeeId(username: string): Observable<Project[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Project[]>(
      `http://localhost:8082/api/employee/${username}/projects`,
      { headers }
    );
  }
}
