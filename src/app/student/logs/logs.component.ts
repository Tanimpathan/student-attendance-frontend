// ...existing code...
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../core/services/student.service';
import { StudentLoginActivity } from '../../core/interfaces/student.interface';

@Component({
  selector: 'app-student-logs',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class StudentLogsComponent implements OnInit {
  myLogs: StudentLoginActivity[] = [];
  period: string = "";

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.student_id) {
      this.studentService.getLoginActivity(user.student_id).subscribe({
        next: (logs) => {
          this.myLogs = logs.login_activity;          
          this.period = logs.period
        },
        error: () => this.myLogs = []
      });
    }
  }
}
