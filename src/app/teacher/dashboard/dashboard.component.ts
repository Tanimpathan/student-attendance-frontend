import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TeacherService } from '../../core/services/teacher.service';
import { TeacherDashboardData } from '../../core/interfaces/teacher.interface';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class TeacherDashboardComponent implements OnInit {
  dashboardData: TeacherDashboardData = {
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    recentActivities: [],
  };

  constructor(private teacherService: TeacherService) { }

  ngOnInit() {
    this.teacherService.getTeacherDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
      },
    });

    // Removed the local storage student count, as it will come from the API.
    // const students = JSON.parse(localStorage.getItem('students') || '[]') as Array<{
    //   active: boolean;
    // }>;
    // this.dashboardData.totalStudents = students.length;
    // const key = 'student_attendance_days';
    // const days: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    // const today = new Date().toISOString().slice(0, 10);
    // const presentToday = days.includes(today) ? 1 : 0; // demo: per-student tracking comes with backend
    // this.presentToday = presentToday;
    // this.absentToday = Math.max(0, this.dashboardData.totalStudents - presentToday);
  }
}
