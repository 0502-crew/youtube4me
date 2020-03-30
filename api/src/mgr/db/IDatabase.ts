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
  id: string;
  date: string;
  videoDetails: IVideoDetails;
}

export interface IVideoDetails {
  id: string,
  publishedAt: string,
  title: string,
  description: string,
  thumbnails: {
    default: IThumbnail,
    medium: IThumbnail,
    high: IThumbnail,
    standard: IThumbnail,
    maxres: IThumbnail,
  },
  channelId: string,
  channelTitle: string,
  duration: {
    hours: number,
    minutes: number,
    seconds: number,
  },
  caption: boolean,
}

export interface IThumbnail {
  url: string,
  width: number,
  height: number
}