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
