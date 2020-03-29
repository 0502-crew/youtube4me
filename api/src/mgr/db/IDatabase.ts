export const INITIAL_DB: IDatabase = {
  notifications: [],
}

export const NOTIFICATIONS = 'notifications';
export const NOTIFICATION_VIDEO_ID = 'videoID';
export const NOTIFICATION_DATE = 'date';

export interface IDatabase {
  notifications: INotification[];
}

export interface INotification {
  videoID: string;
  date: string;
}