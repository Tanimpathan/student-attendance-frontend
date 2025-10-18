import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Student } from '../../core/interfaces/teacher.interface';

function formatDateForInput(isoDateString: string | undefined): string | null {
  if (!isoDateString) {
    return null;
  }
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      return null; // Invalid date string
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return null;
  }
}

@Component({
  selector: 'app-add-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.css'],
})
export class AddStudentDialogComponent {
  studentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student
  ) {
    this.studentForm = new FormGroup({
      username: new FormControl(this.data?.username || '', Validators.required),
      email: new FormControl(this.data?.email || '', [Validators.required, Validators.email]),
      password: new FormControl('', this.data ? [] : Validators.required), // Password not required for edit
      mobile: new FormControl(this.data?.mobile || '', Validators.pattern(/^\d{10,15}$/)), // Added mobile validation
      first_name: new FormControl(this.data?.first_name || ''),
      last_name: new FormControl(this.data?.last_name || ''),
      date_of_birth: new FormControl(formatDateForInput(this.data?.date_of_birth) || '', Validators.required),
      address: new FormControl(this.data?.address || ''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.dialogRef.close(this.studentForm.value);
    }
  }
}
