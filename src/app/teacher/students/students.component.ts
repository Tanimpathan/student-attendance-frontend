import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
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
import { AddStudentDialogComponent } from './add-student-dialog.component';
import { UploadCsvDialogComponent } from './upload-csv-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import {
  ReusableTableComponent,
  TableColumn,
} from '../../components/reusable-table/reusable-table.component';

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
    ReusableTableComponent,
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class TeacherStudentsComponent implements OnInit, OnDestroy {
  // displayedColumns: (keyof Student | 'actions')[] = [
  //   'username',
  //   'first_name',
  //   'email',
  //   'mobile',
  //   'is_active',
  //   'actions',
  // ];
  // dataSource = new MatTableDataSource<Student>([]);
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
  @ViewChild(ReusableTableComponent) table!: ReusableTableComponent<Student>;

  columns: TableColumn[] = [
    { key: 'username', header: 'Username', sortable: true },
    { key: 'first_name', header: 'First Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'mobile', header: 'Mobile', sortable: true },
    { key: 'is_active', header: 'Status', sortable: true, customTemplate: 'statusTemplate' },
    { key: 'actions', header: 'Actions', sortable: false, customTemplate: 'actionsTemplate' },
  ];

  students: any[] = [];
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
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.currentPage = +(params['page'] || 0);
      this.pageSize = +(params['limit'] || 10);
      this.filterValue = params['filterValue'] || '';
      this.sortBy = params['sortBy'] || 'username';
      this.sortOrder = (params['sortOrder'] as SortDirection) || 'asc';
      this.loadStudents();
    });
  }

  ngAfterViewInit() {
    // Register custom templates with the table
    this.table.registerTemplate('statusTemplate', this.statusTemplate);
    this.table.registerTemplate('actionsTemplate', this.actionsTemplate);

    // setTimeout(() => {
    //   this.paginator.pageIndex = this.currentPage;
    //   this.paginator.pageSize = this.pageSize;
    //   this.sort.direction = this.sortOrder;
    //   this.sort.active = this.sortBy;
    // });

    // this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   this.currentPage = 0;
    //   this.updateQueryParams();
    // });

    // this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe((event) => {
    //   this.currentPage = event.pageIndex;
    //   this.pageSize = event.pageSize;
    //   this.updateQueryParams();
    // });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudents() {
    console.log('Loading students with params:', {
      page: this.currentPage + 1,
      limit: this.pageSize,
      filterValue: this.filterValue,
      filterBy: 'username',
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    });
    this.teacherService
      .getStudents(
        this.currentPage + 1,
        this.pageSize,
        this.filterValue,
        'username',
        this.sortBy,
        this.sortOrder || undefined
      )
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          this.students = response.students;
          // this.dataSource.data = response.students;
          this.totalStudents = response.pagination.totalStudents;
          this.currentPage = response.pagination.currentPage - 1;
          this.pageSize = response.pagination.perPage;

          // if (this.paginator) {
          //   this.paginator.pageIndex = this.currentPage;
          //   this.paginator.pageSize = this.pageSize;
          // }
        },
        error: (err) => {
          console.error('Error fetching students', err);
          this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
        },
      });
  }

  updateQueryParams() {
    const queryParams = {
      page: this.currentPage,
      limit: this.pageSize,
      filterValue: this.filterValue || undefined,
      filterBy: this.filterValue ? 'username' : undefined,
      sortBy: this.sortBy || undefined,
      sortOrder: this.sortOrder || undefined,
    };
    console.log('Updating query params:', queryParams);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 0;
    this.updateQueryParams();
  }

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

  onUpload() {
    const dialogRef = this.dialog.open(UploadCsvDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const file: File = result;
        this.teacherService.uploadStudentsCsv(file).subscribe({
          next: () => {
            this.snackBar.open('Students uploaded successfully', 'Close', { duration: 3000 });
            this.loadStudents();
          },
          error: (err) => {
            console.error('Error uploading students CSV', err);
            this.snackBar.open(
              err.error.error.message || 'Failed to upload students CSV',
              'Close',
              {
                duration: 3000,
              }
            );
          },
        });
      }
    });
  }

  openAddStudentDialog() {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teacherService.addStudent(result).subscribe({
          next: () => {
            this.snackBar.open('Student added successfully', 'Close', { duration: 3000 });
            this.loadStudents();
          },
          error: (err) => {
            console.error('Error adding student', err);
            this.snackBar.open('Failed to add student', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  editStudent(student: Student) {
    if (!student.student_id) {
      this.snackBar.open('Student ID not found for editing', 'Close', { duration: 3000 });
      return;
    }
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '600px',
      data: student,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teacherService.updateStudent(student.student_id!, result).subscribe({
          next: () => {
            this.snackBar.open(`${result.username} updated successfully`, 'Close', {
              duration: 3000,
            });
            this.loadStudents();
          },
          error: (err) => {
            console.error('Error updating student', err);
            this.snackBar.open(`Failed to update ${result.username}`, 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  deactivateStudent(student: Student) {
    if (student.student_id) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { message: `Are you sure you want to deactivate ${student.username}?` },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.teacherService.deactivateStudentApi(student.student_id!).subscribe({
            next: () => {
              this.snackBar.open(`${student.username} deactivated successfully`, 'Close', {
                duration: 3000,
              });
              this.loadStudents();
            },
            error: (err) => {
              console.error('Error deactivating student', err);
              this.snackBar.open(`Failed to deactivate ${student.username}`, 'Close', {
                duration: 3000,
              });
            },
          });
        }
      });
    } else {
      this.snackBar.open('Student ID not found for deactivation', 'Close', { duration: 3000 });
    }
  }

  downloadSampleCsv() {
    const csvContent = `username,email,password,mobile,first_name,last_name,address\nmaria,maria@school.com,test1234!,01234567899,maria,lopez,dhaka`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    a.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('Sample CSV downloaded successfully', 'Close', { duration: 3000 });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateQueryParams();
  }

  onSortChange(event: Sort) {
    this.sortBy = event.active;
    this.sortOrder = event.direction;
    this.currentPage = 0;
    this.updateQueryParams();
  }
}
