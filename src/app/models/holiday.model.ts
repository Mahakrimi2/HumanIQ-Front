import { User } from "./user.model";

export class Holiday {
  id?: number;
  startDate!: Date;
  duration!: number;
    type!: string;
    reason!:string
  status!: string;
  file?: string;
  user?: User;
}