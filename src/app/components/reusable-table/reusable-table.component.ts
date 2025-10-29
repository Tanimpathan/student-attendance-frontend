import { Component, Input, Output, EventEmitter, ViewChild, ContentChildren, QueryList, TemplateRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  customTemplate?: string;
}

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule
  ],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.css'
})
export class ReusableTableComponent<T> implements AfterContentInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 0;
  @Input() pageSizeOptions = [5, 10, 20, 50];
  @Input() sortBy = '';
  @Input() sortOrder: 'asc' | 'desc' | '' = 'asc';
  @Input() showPagination = true;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>([]);
  templates: { [key: string]: TemplateRef<any> } = {};

  get displayedColumns(): string[] {
    return this.columns.map(col => col.key);
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
  }

  ngAfterContentInit() {
    // Templates will be registered by parent component
  }

  registerTemplate(name: string, template: TemplateRef<any>) {
    this.templates[name] = template;
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  onSortChange(event: Sort) {
    this.sortChange.emit(event);
  }
}
