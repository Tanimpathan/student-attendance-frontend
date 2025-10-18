import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../../core/services/student.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class StudentAttendanceComponent implements OnInit {
  studentId: number;
  isPresentToday: boolean | null = null;
  loading = false;

  constructor(
    private studentService: StudentService,
    private toastr: ToastrService
  ) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.studentId = user.student_id;
  }

  ngOnInit() {
    console.log('studentId', this.studentId);
    this.loadTodayAttendance();    
  }

  loadTodayAttendance() {
    this.studentService.getTodayAttendance(this.studentId).subscribe({
      next: (res: { today_attendance: { is_present: boolean } }) => {
        this.isPresentToday = res?.today_attendance?.is_present ?? false;
        console.log('isPresentToday', res);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || "Failed to get today's attendance");
        this.isPresentToday = null;
      }
    });
  }

  markPresent() {
    this.loading = true;
    this.studentService.markAttendance(this.studentId, !this.isPresentToday).subscribe({
      next: () => {
        this.toastr.success(
          !this.isPresentToday
            ? 'Attendance marked successfully'
            : 'Attendance unmarked successfully'
        );
        this.studentService.loadProfile(this.studentId);
        this.loadTodayAttendance();
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Failed to update attendance');
        this.loading = false;
      }
    });
  }
}
