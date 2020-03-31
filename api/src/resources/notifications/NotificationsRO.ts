import { INotification } from '@src/mgr/db/IDatabase';

export interface NotificationsRO {
  currentPage: number;
  lastPage: number;
  notifications: INotification[];
}