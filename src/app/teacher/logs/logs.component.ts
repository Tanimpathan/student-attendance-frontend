import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TeacherService } from '../../core/services/teacher.service';
import { TeacherLoginActivity } from '../../core/interfaces/teacher.interface';

@Component({
  selector: 'app-teacher-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class TeacherLogsComponent implements OnInit {
  displayedColumns: (keyof TeacherLoginActivity)[] = [
    'login_time',
    'ip_address',
    'user_agent',
    'status',
  ];
  dataSource = new MatTableDataSource<TeacherLoginActivity>([]);

  constructor(
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadLoginActivity();
  }

  loadLoginActivity() {
    this.teacherService.getTeacherLoginActivity().subscribe({
      next: (response) => {
        console.log('Login Activity API Response:', response);
        this.dataSource.data = response.login_activity;
      },
      error: (err) => {
        console.error('Error fetching login activity', err);
        this.snackBar.open('Failed to load login activity', 'Close', { duration: 3000 });
      }
    });
  }
}
