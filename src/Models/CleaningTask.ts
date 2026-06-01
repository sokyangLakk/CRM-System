export interface CleaningTask {
  id?: number;
  task_name: string;
  description?: string | null;
  points?: number;
  created_at?: Date;
  updated_at?: Date;
}
