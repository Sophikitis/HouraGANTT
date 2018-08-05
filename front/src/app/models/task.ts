export class Task {
  id: number;
  start_date: string;
  text: string;
  progress: number;
  duration: number;
  parent: number;
  created_at?: string;
  updated_at?: string;
}
