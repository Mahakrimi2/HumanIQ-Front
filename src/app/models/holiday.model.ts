import { User } from "./user.model";

export class Holiday {
  id?: number;
  startDate!: Date;
  duration!: number;
    type!: string;
    reason!:string
  status!: string;
  ficher?: string;
  user?: User;
}