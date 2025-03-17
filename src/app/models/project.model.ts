import { User } from "./user.model";

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  employees?: any[];
  projectManager?:User;
}