import { IVideo } from '@src/resources/feed/IVideo';

export const INITIAL_DB: IDatabase = {
  videos: [],
  watched: [],
}

export const TABLE_VIDEOS = 'videos';
export const TABLE_WATCHED = 'watched';
export const ATTR_PUBLISHED = 'published';

export interface IDatabase {
  videos: IVideo[];
  watched: string[];
}