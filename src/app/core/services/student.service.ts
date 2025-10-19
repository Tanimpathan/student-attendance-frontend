import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Remove HttpHeaders import
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginActivityResponse, StudentLoginActivity } from '../interfaces/student.interface';

export interface StudentProfile {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  address: string;
  present_days: number;
  absent_days: number;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private profileSubject = new BehaviorSubject<StudentProfile | null>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Mark attendance for today
   */
  markAttendance(studentId: number, is_present: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/student/mark-attendance/${studentId}`, { is_present });
  }

  /**
   * Get login activity logs for a student
   */
  getLoginActivity(studentId: number): Observable<LoginActivityResponse> {
    return this.http.get<LoginActivityResponse>(`${environment.apiUrl}/student/login-activity/${studentId}`);
  }

  /**
   * Get today's attendance status
   */
  getTodayAttendance(studentId: number): Observable<{ today_attendance: { is_present: boolean } }> {
    return this.http.get<{ today_attendance: { is_present: boolean } }>(`${environment.apiUrl}/student/today-attendance/${studentId}`);
  }

  fetchProfile(studentId: number): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${environment.apiUrl}/student/profile/${studentId}`);
  }

  loadProfile(studentId: number): void {
    this.fetchProfile(studentId).subscribe({
      next: (profile) => this.profileSubject.next(profile),
      error: () => this.profileSubject.next(null)
    });
  }

  updateProfile(studentId: number, data: Partial<StudentProfile>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/student/edit-profile/${studentId}`, data);
  }

  getProfileValue(): StudentProfile | null {
    return this.profileSubject.value;
  }
}