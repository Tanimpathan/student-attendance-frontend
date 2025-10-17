import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },

      // Public
      {
        path: 'login',
        loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent),
      },

      // Teacher area
      {
        path: 'teacher',
        loadComponent: () =>
          import('./layout/teacher-layout.component').then((m) => m.TeacherLayoutComponent),
        canMatch: [
          () => import('./core/guards/auth.guard').then((m) => m.authGuard),
          () => import('./core/guards/role.guard').then((m) => m.roleGuard('teacher')),
        ],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./teacher/dashboard.component').then((m) => m.TeacherDashboardComponent),
          },
          {
            path: 'students',
            loadComponent: () =>
              import('./teacher/students.component').then((m) => m.TeacherStudentsComponent),
          },
          {
            path: 'attendance',
            loadComponent: () =>
              import('./teacher/attendance.component').then((m) => m.TeacherAttendanceComponent),
          },
          {
            path: 'logs',
            loadComponent: () =>
              import('./teacher/logs.component').then((m) => m.TeacherLogsComponent),
          },
        ],
      },

      // Student area
      {
        path: 'student',
        loadComponent: () =>
          import('./layout/student-layout.component').then((m) => m.StudentLayoutComponent),
        canMatch: [
          () => import('./core/guards/auth.guard').then((m) => m.authGuard),
          () => import('./core/guards/role.guard').then((m) => m.roleGuard('student')),
        ],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./student/dashboard.component').then((m) => m.StudentDashboardComponent),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./student/profile.component').then((m) => m.StudentProfileComponent),
          },
          {
            path: 'attendance',
            loadComponent: () =>
              import('./student/attendance.component').then((m) => m.StudentAttendanceComponent),
          },
          {
            path: 'logs',
            loadComponent: () =>
              import('./student/logs.component').then((m) => m.StudentLogsComponent),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
