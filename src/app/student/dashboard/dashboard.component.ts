import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  present = 0;
  absent = 0;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService.profile$.subscribe(profile => {
      console.log('profile', profile);
      if (profile) {
        this.present = profile.present_days;
        this.absent = profile.absent_days;
      }
    });
  }
}
