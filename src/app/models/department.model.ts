import { User } from './user.model';

export interface Department {
  id?: number;
  name: string;
  responsableDep: User | null;
  users?: User[];
  totalEmployees?: number;
}

