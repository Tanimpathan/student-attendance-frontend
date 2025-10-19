import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    this.authService.login({ username, password }).subscribe({
      next: (response) => {
        this.toastr.success('Login successful');
        
        if (response.user.role === 'student' && response.user.student_id) {
          const studentId = response.user.student_id;
          
          import('../../core/services/student.service').then(({ StudentService }) => {
            const injector = (window as any).ng?.injector;
            const studentService = injector?.get(StudentService);
            if (studentService) {
              studentService.loadProfile(studentId);
            }
          });
        }
        
        this.router.navigate([response.user.role === 'teacher' ? '/teacher' : '/student']);
      },
      error: (error: HttpErrorResponse) => {
        
        const apiMsg = error?.error?.message;
        if (apiMsg) {
          this.toastr.error(apiMsg);
        } else if (error.status === 401) {
          this.toastr.error('Invalid username or password');
        } else if (error.status === 403) {
          this.toastr.error('Your account is deactivated');
        } else {
          this.toastr.error('An error occurred while logging in');
        }
      }
    });
  }
}