import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class TeacherAttendanceComponent {}
