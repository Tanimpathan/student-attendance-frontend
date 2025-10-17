import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class TeacherDashboardComponent {
  totalStudents = 0;
  presentToday = 0;
  absentToday = 0;

  ngOnInit() {
    const students = JSON.parse(localStorage.getItem('students') || '[]') as Array<{
      active: boolean;
    }>;
    this.totalStudents = students.length;
    const key = 'student_attendance_days';
    const days: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    const today = new Date().toISOString().slice(0, 10);
    const presentToday = days.includes(today) ? 1 : 0; // demo: per-student tracking comes with backend
    this.presentToday = presentToday;
    this.absentToday = Math.max(0, this.totalStudents - presentToday);
  }
}
