export interface TeacherDashboardData {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  recentActivities: any[]; // Define a more specific interface for activities if needed
  // Add other relevant dashboard data fields here
}

export interface Student {
  id?: number;
  user_id?: number;
  student_id?: number;
  username: string;
  email: string;
  password?: string;
  mobile?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  address?: string;
  is_active?: boolean;
}

export interface StudentPaginationResponse {
  students: Student[];
  pagination: {
    totalStudents: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  username: string;
  first_name: string;
  last_name: string;
  date: string; // ISO date string
  status: 'present' | 'absent' | 'late';
  check_in_time?: string; // Optional
  check_out_time?: string; // Optional
}

export interface AttendancePaginationResponse {
  attendanceRecords: AttendanceRecord[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

export interface TeacherLoginActivity {
  login_time: string;
  ip_address: string;
  user_agent: string;
  status: 'success' | 'failure';
}

export interface TeacherLoginActivityResponse {
  login_activity: TeacherLoginActivity[];
  total_count: number;
  period: string;
  id: string;
}
