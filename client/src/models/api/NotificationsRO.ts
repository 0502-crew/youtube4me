import { INotification } from './INotification';

export interface NotificationsRO {
  currentPage: number;
  lastPage: number;
  notifications: INotification[];
}