import { User } from "./user.model";


export interface Payslip {
  id?: number; 
  filename: string;
  salary: number;
  generatedDate: string; 
  user: User;
}
