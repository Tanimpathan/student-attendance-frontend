export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  mobile: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'student' | 'teacher';
    student_id?: number;
    roles: [],
    permissions: []
  };
}

export interface ErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
}