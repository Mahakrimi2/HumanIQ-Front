import { User } from "./user.model";

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  projectStatus: string;
  employees?: any[];
  projectManager?: User;
  priority: string;
}