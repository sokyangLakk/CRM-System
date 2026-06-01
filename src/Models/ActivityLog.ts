export interface ActivityLog {
  id?: number;
  user_id?: number | null;
  action: string;
  description?: string | null;
  ip_address?: string | null;
  created_at?: Date;
}
