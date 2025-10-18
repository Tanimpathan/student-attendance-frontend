import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload-csv-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './upload-csv-dialog.component.html',
  styleUrls: ['./upload-csv-dialog.component.css'],
})
export class UploadCsvDialogComponent {
  selectedFile: File | null = null;

  constructor(public dialogRef: MatDialogRef<UploadCsvDialogComponent>) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onUploadClick(): void {
    if (this.selectedFile) {
      this.dialogRef.close(this.selectedFile);
    } else {
      this.dialogRef.close(null);
    }
  }
}
