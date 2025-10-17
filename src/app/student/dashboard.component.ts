import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class StudentDashboardComponent {
  present = 0;
  absent = 0;

  ngOnInit() {
    const key = 'student_attendance_days';
    const days: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    this.present = days.length;
    // demo-only: no total days known; show 0 absent
    this.absent = 0;
  }
}
