export interface CleaningSchedule {
  id?: number;
  date: string | Date;
  day_type: 'normal' | 'wednesday' | 'punishment';  // Add this
  class_id: number;      // Add this
  teacher_id: number;    // Add this
  description?: string | null;
  status?: 'pending' | 'completed' | 'cancelled';
  created_at?: Date;
}