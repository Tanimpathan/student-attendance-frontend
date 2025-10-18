import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Student } from '../../core/interfaces/teacher.interface';

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
      mobile: new FormControl(this.data?.mobile || ''),
      first_name: new FormControl(this.data?.first_name || ''),
      last_name: new FormControl(this.data?.last_name || ''),
      date_of_birth: new FormControl(this.data?.date_of_birth || ''),
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
