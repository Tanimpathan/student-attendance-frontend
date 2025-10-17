import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class StudentAttendanceComponent {
  markPresent() {
    const key = 'student_attendance_days';
    const days: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    const today = new Date().toISOString().slice(0, 10);
    if (!days.includes(today)) {
      days.push(today);
      localStorage.setItem(key, JSON.stringify(days));
      alert('Attendance marked');
    } else {
      alert('Already marked for today');
    }
  }
}
