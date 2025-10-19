import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../core/services/teacher.service';
import { AttendanceRecord, AttendancePaginationResponse } from '../../core/interfaces/teacher.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class TeacherAttendanceComponent implements OnInit, OnDestroy {
  displayedColumns: (keyof AttendanceRecord | 'actions')[] = [
    'username',
    'first_name',
    'last_name',
    'date',
  ];
  dataSource = new MatTableDataSource<AttendanceRecord>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  totalRecords = 0;
  pageSize = 10;
  currentPage = 0;
  sortBy = 'date';
  sortOrder: SortDirection = 'desc';

  private destroy$ = new Subject<void>();

  constructor(
    private teacherService: TeacherService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.currentPage = +(params['page'] || 0);
      this.pageSize = +(params['limit'] || 10);
      this.sortBy = params['sortBy'] || 'date';
      this.sortOrder = (params['sortOrder'] as SortDirection) || 'desc';
      this.loadAttendance();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.pageSize = this.pageSize;
      this.sort.direction = this.sortOrder;
      this.sort.active = this.sortBy;
    });

    this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.currentPage = 0;
      this.updateQueryParams();
    });

    this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe(event => {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updateQueryParams();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAttendance() {
    console.log('Loading attendance with params:', {
      page: this.currentPage + 1,
      limit: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });
    this.teacherService.getAttendance(
      this.currentPage + 1,
      this.pageSize,
      this.sortBy,
      this.sortOrder || undefined
    ).subscribe({
      next: (response) => {
        console.log('Attendance API Response:', response);
        this.dataSource.data = response.attendanceRecords;
        this.totalRecords = response.pagination.totalRecords;
        this.currentPage = response.pagination.currentPage - 1;
        this.pageSize = response.pagination.perPage;

        if (this.paginator) {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.pageSize = this.pageSize;
        }
      },
      error: (err) => {
        console.error('Error fetching attendance records', err);
        this.snackBar.open('Failed to load attendance records', 'Close', { duration: 3000 });
      }
    });
  }

  updateQueryParams() {
    const queryParams = {
      page: this.currentPage,
      limit: this.pageSize,
      sortBy: this.sort.active || undefined,
      sortOrder: this.sort.direction || undefined,
    };
    console.log('Updating attendance query params:', queryParams);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
