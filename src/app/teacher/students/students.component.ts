import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Student {
  id: string;
  username: string;
  name: string;
  email: string;
  mobile: string;
  active: boolean;
}

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
export class TeacherStudentsComponent {
  displayedColumns: (keyof Student | 'actions')[] = [
    'username',
    'name',
    'email',
    'mobile',
    'active',
    'actions',
  ];
  dataSource = new MatTableDataSource<Student>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const saved = localStorage.getItem('students');
    if (saved) this.dataSource.data = JSON.parse(saved);
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  addMock() {
    const list = this.dataSource.data.slice();
    const n = list.length + 1;
    const username = `student${n}`;
    if (list.some((s) => s.username === username)) return;
    list.push({
      id: crypto.randomUUID(),
      username,
      name: `Student ${n}`,
      email: `s${n}@mail.com`,
      mobile: `90000${n.toString().padStart(5, '0')}`,
      active: true,
    });
    this.dataSource.data = list;
    localStorage.setItem('students', JSON.stringify(list));
  }

  edit(_s: Student) {
    alert('Edit UI placeholder');
  }
  deactivate(s: Student) {
    const list = this.dataSource.data.map((x) => (x.id === s.id ? { ...x, active: false } : x));
    this.dataSource.data = list;
    localStorage.setItem('students', JSON.stringify(list));
  }

  download() {
    const rows = [
      ['username', 'name', 'email', 'mobile', 'active'],
      ...this.dataSource.data.map((s) => [s.username, s.name, s.email, s.mobile, String(s.active)]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  onUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const rows = text
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) =>
          line.split(',').map((cell) => cell.replace(/^\"|\"$/g, '').replaceAll('""', '"'))
        );
      const [header, ...data] = rows;
      const required = ['username', 'name', 'email', 'mobile', 'active'];
      if (!header || required.some((h, i) => (header[i] || '').toLowerCase() !== h)) {
        alert('Invalid CSV header. Expected: ' + required.join(','));
        return;
      }
      const existing = this.dataSource.data.slice();
      const usernames = new Set(existing.map((s) => s.username));
      const duplicates: string[] = [];
      const toAdd: Student[] = [];
      for (const r of data) {
        if (r.length < 5) continue;
        const [username, name, email, mobile, active] = r;
        if (usernames.has(username)) {
          duplicates.push(username);
          continue;
        }
        usernames.add(username);
        toAdd.push({
          id: crypto.randomUUID(),
          username,
          name,
          email,
          mobile,
          active: String(active).toLowerCase() === 'true',
        });
      }
      const next = existing.concat(toAdd);
      this.dataSource.data = next;
      localStorage.setItem('students', JSON.stringify(next));
      if (duplicates.length) alert(`Skipped duplicates: ${duplicates.join(', ')}`);
      (input as any).value = '';
    };
    reader.readAsText(file);
  }
}
