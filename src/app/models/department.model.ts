import { User } from './user.model';

export interface Department {
  id?: number; 
  name: string; 
  responsableDep: User; 
  users?: User[]; 
}
