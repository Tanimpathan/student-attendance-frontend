import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class StudentProfileComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
    });
    const saved = localStorage.getItem('student_profile');
    if (saved) this.form.patchValue(JSON.parse(saved));
  }

  save() {
    localStorage.setItem('student_profile', JSON.stringify(this.form.value));
    alert('Saved');
  }
}
