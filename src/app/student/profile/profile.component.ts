import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class StudentProfileComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  studentId: number;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastr: ToastrService
  ) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.studentId = user.student_id;
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.studentService.profile$.subscribe({
      next: (data) => {
        if (data) {
          const patch = { ...data, date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : '' };
          this.form.patchValue(patch);
        }
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load profile');
        this.loading = false;
      }
    });
  }

  save() {
    if (this.form.invalid) return;
    const payload = {
      ...this.form.value,
      date_of_birth: this.formatDate(this.form.value.date_of_birth)
    };
    this.studentService.updateProfile(this.studentId, payload).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.studentService.loadProfile(this.studentId);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Failed to update profile');
      }
    });
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1).toString().padStart(2, '0');
    const day = '' + d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
  }
}
