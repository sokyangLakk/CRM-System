export interface CleaningAssignment {
  id?: number;
  schedule_id: number;
  student_id: number;
  task_id: number;
  status: 'pending' | 'completed' | 'missed';
  points_earned?: number;
  created_at?: Date;
  updated_at?: Date;
}
