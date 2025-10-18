import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const value = this.form.value as {
      username: string;
      password: string;
      role: 'teacher' | 'student';
    };
    if (value.role === 'student') {
      // Active students only
      const students = JSON.parse(localStorage.getItem('students') || '[]') as Array<{
        username: string;
        active: boolean;
      }>;
      const found = students.find((s) => s.username === value.username);
      if (!found) {
        alert('Student not found. Please ask teacher to add you.');
        return;
      }
      if (!found.active) {
        alert('Your account is deactivated.');
        return;
      }
    }
    // Simulate auth, store token and user
    const token = 'demo-token';
    const user = { id: 'u1', username: value.username, role: value.role };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Add login log
    const logs = JSON.parse(localStorage.getItem('login_logs') || '[]');
    logs.push({
      username: value.username,
      role: value.role,
      at: new Date().toISOString(),
      ip: '127.0.0.1',
    });
    localStorage.setItem('login_logs', JSON.stringify(logs));
    // Redirect based on role
    this.router.navigate([value.role === 'teacher' ? '/teacher' : '/student']);
  }
}