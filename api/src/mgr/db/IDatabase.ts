import { IVideo } from '@src/resources/feed/IVideo';

export const INITIAL_DB: IDatabase = {
  videos: [],
}

export const VIDEOS = 'videos';
export const PUBLISHED = 'published';

export interface IDatabase {
  videos: IVideo[];
}