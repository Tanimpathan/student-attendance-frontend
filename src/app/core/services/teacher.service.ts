import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TeacherDashboardData, Student, StudentPaginationResponse, AttendancePaginationResponse, TeacherLoginActivityResponse } from '../interfaces/teacher.interface';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTeacherDashboardData(): Observable<TeacherDashboardData> {
    return this.http.get<TeacherDashboardData>(`${this.apiUrl}/teachers/dashboard`);
  }

  uploadStudentsCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('csvFile', file);
    return this.http.post(`${this.apiUrl}/teachers/students/upload`, formData);
  }

  downloadStudentsCsv(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/teachers/students/download`, { responseType: 'blob' });
  }

  getStudents(page: number, limit: number, filterValue?: string, filterBy?: string, sortBy?: string, sortOrder?: string): Observable<StudentPaginationResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filterValue && filterBy) {
      params = params.set('filterBy', filterBy);
      params = params.set('filterValue', filterValue);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    return this.http.get<StudentPaginationResponse>(`${this.apiUrl}/teachers/students`, { params });
  }

  addStudent(studentData: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/teachers/students`, studentData);
  }

  deactivateStudentApi(studentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/teachers/students/${studentId}/deactivate`, {});
  }

  updateStudent(studentId: number, studentData: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/teachers/students/${studentId}`, studentData);
  }

  getAttendance(page: number, limit: number, sortBy?: string, sortOrder?: string): Observable<AttendancePaginationResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }
    return this.http.get<AttendancePaginationResponse>(`${this.apiUrl}/teachers/attendance`, { params });
  }

  getTeacherLoginActivity(): Observable<TeacherLoginActivityResponse> {
    return this.http.get<TeacherLoginActivityResponse>(`${this.apiUrl}/teachers/login-activity`);
  }
}
