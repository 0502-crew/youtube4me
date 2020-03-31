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