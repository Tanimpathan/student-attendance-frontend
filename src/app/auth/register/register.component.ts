import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
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

@Component({
  selector: 'app-register',
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
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9_]+$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      mobile: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10,}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^.{6,}$')
      ]],
    });
  }

  onSubmit() {
    if (this.form.invalid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/auth/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;

        const apiMsg = error?.error?.message;
        if (apiMsg) {
          this.toastr.error(apiMsg);
        } else if (error.status === 400 && error.error?.errors) {
          
          Object.keys(error.error.errors).forEach(key => {
            const control = this.form.get(key);
            if (control) {
              control.setErrors({ serverError: error.error.errors[key][0] });
            }
          });
          this.toastr.error('Please correct the errors in the form');
        } else if (error.status === 409) {
          this.toastr.error('Username or email already exists');
        } else {
          this.toastr.error('An error occurred while registering');
        }
      }
    });
  }

  // get username() { return this.form.get('username'); }
  // get email() { return this.form.get('email'); }
  // get mobile() { return this.form.get('mobile'); }
  // get password() { return this.form.get('password'); }

  // getErrorMessage(controlName: string): string {
  //   const control = this.form.get(controlName);
  //   if (!control?.errors) return '';

  //   if (control.errors['required']) return `${controlName} is required`;
  //   if (control.errors['email']) return 'Invalid email address';
  //   if (control.errors['minlength']) {
  //     return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
  //   }
  //   if (control.errors['pattern']) {
  //     switch (controlName) {
  //       case 'username':
  //         return 'Username can only contain letters, numbers and underscore';
  //       case 'mobile':
  //         return 'Mobile number must be atleast 10 digits';
  //       case 'password':
  //         return 'Password must contain at least one uppercase letter, one lowercase letter and one number';
  //       default:
  //         return `Invalid ${controlName} format`;
  //     }
  //   }
  //   if (control.errors['serverError']) return control.errors['serverError'];

  //   return '';
  // }
}