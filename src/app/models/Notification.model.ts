import { User } from "./user.model";
import { Event } from './event.model';
export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
  recipient?: User; // Assurez-vous que User est également correctement typé
  event?: Event;
}
