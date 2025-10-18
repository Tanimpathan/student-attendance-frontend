import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TeacherService } from '../../core/services/teacher.service';
import { Student, StudentPaginationResponse } from '../../core/interfaces/teacher.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class TeacherStudentsComponent implements OnInit, OnDestroy {
  displayedColumns: (keyof Student | 'actions')[] = [
    'username',
    'first_name',
    'email',
    'mobile',
    // 'active',
    'actions',
  ];
  dataSource = new MatTableDataSource<Student>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  totalStudents = 0;
  pageSize = 10;
  currentPage = 0;
  filterValue = '';
  sortBy = 'username';
  sortOrder: SortDirection = 'asc';

  private destroy$ = new Subject<void>();

  constructor(
    private teacherService: TeacherService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.currentPage = +(params['page'] || 0);
      this.pageSize = +(params['limit'] || 10);
      this.filterValue = params['filterValue'] || '';
      this.sortBy = params['sortBy'] || 'username';
      this.sortOrder = (params['sortOrder'] as SortDirection) || 'asc';
      this.loadStudents();
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.currentPage = 0;
      this.updateQueryParams();
    });

    this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateQueryParams();
    });

    // Initial load when paginator and sort are ready
    // if (this.dataSource.data.length === 0) {
    //   this.loadStudents();
    // }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudents() {
    this.teacherService.getStudents(
      this.currentPage + 1, // API is 1-based, Paginator is 0-based
      this.pageSize,
      this.filterValue,
      this.sortBy,
      this.sortOrder || undefined
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response.students;
        this.totalStudents = response.total_count;
      },
      error: (err) => {
        console.error('Error fetching students', err);
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
      }
    });
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: this.currentPage,
        limit: this.pageSize,
        filterValue: this.filterValue || undefined,
        sortBy: this.sort.active || undefined,
        sortOrder: this.sort.direction || undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 0;
    this.updateQueryParams();
  }

  // Removed addMock, edit, deactivate for now. Will be replaced with API calls and dialogs.

  download() {
    this.teacherService.downloadStudentsCsv().subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.csv';
        a.click();
        URL.revokeObjectURL(url);
        this.snackBar.open('Students CSV downloaded successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error downloading students CSV', err);
        this.snackBar.open('Failed to download students CSV', 'Close', { duration: 3000 });
      },
    });
  }

  onUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    this.teacherService.uploadStudentsCsv(file).subscribe({
      next: () => {
        this.snackBar.open('Students uploaded successfully', 'Close', { duration: 3000 });
        this.loadStudents(); // Reload students after upload
      },
      error: (err) => {
        console.error('Error uploading students CSV', err);
        this.snackBar.open('Failed to upload students CSV', 'Close', { duration: 3000 });
      },
    });
    (input as any).value = ''; // Clear the file input
  }

  openAddStudentDialog() {
    // Implement MatDialog to open a form for adding a student
    // This will be a separate component that takes student data
    // After dialog close, if data is returned, call addStudent and reload table
    this.snackBar.open('Add student dialog placeholder', 'Close', { duration: 3000 });
  }

  editStudent(student: Student) {
    this.snackBar.open('Edit student dialog placeholder', 'Close', { duration: 3000 });
  }

  deactivateStudent(student: Student) {
    this.snackBar.open('Deactivate student API call placeholder', 'Close', { duration: 3000 });
  }
}
