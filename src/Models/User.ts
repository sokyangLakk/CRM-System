export interface User {
  id?: number;
  username: string;
  password?: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  created_at?: Date;
  updated_at?: Date;
}
