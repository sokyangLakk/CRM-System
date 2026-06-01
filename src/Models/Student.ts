export interface Student {
  id?: number;
  user_id?: number | null;
  name: string;
  student_number: string;
  class_id?: number | null;
  email?: string | null;
  phone?: string | null;
  status: 'active' | 'graduated' | 'suspended';
  created_at?: Date;
  updated_at?: Date;
}
