export type ClassStatus = "active" | "archived" | "upcoming";

export interface ClassItem {
  id: string;
  name: string;
  subject: string;
  schedule: string[];
  studentCount: number;
  status: ClassStatus;
  imageUrl?: string;
}
