import { INotification } from '@src/mgr/db/IDatabase';

export interface NotificationsRO {
  notifications: INotification[];
}