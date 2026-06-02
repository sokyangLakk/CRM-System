export interface PunishmentRecord {
  id?: number;
  student_id: number;
  offense: string;
  punishment_type: string;
  points_deducted?: number;
  status: 'pending' | 'completed' | 'appealed';
  created_by?: number | null;
  created_at?: Date;
  updated_at?: Date;
}
