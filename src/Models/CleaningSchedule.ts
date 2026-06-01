export interface CleaningSchedule {
  id?: number;
  date: string | Date; // YYYY-MM-DD
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
