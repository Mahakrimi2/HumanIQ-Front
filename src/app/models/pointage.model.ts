import { User } from "./user.model";

export interface pointage {
  id: number;
  arrivalTime: string; 
  departureTime?: string;
  pauseStartTime?: string; 
    pauseEndTime?: string;
    date?: Date;
    status?: string;
    workingTime?: string;
    user:User
}