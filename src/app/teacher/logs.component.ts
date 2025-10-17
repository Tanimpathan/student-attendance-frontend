import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-logs',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class TeacherLogsComponent {
  logs: Array<{ username: string; role: string; at: string; ip: string }> = [];
  ngOnInit() {
    this.logs = JSON.parse(localStorage.getItem('login_logs') || '[]');
  }
}
