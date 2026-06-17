export interface Teacher {
  id?: number;
  user_id?: number | null;
  name: string;
  department?: string;
  email: string;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
}
