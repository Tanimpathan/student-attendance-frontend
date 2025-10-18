export interface StudentLoginActivity {
  login_time: string;
  ip_address: string;
  user_agent: string;
  status: 'success' | 'failure';
}

export interface LoginActivityResponse {
  login_activity: StudentLoginActivity[];
  total_count: number;
  period: string;
  id: string;
}