import * as path from 'path';
import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import { INITIAL_DB, IDatabase, TABLE_VIDEOS, ATTR_PUBLISHED, TABLE_WATCHED } from './IDatabase';
import { IVideo } from '@src/resources/feed/IVideo';

/**
 * Uses https://www.npmjs.com/package/lowdb
 */
export class DBMgr {
  private readonly JSON_DB_FILE = path.join(process.cwd(), 'db/db.json');
  private static instance: DBMgr;

  private db: lowdb.LowdbSync<IDatabase>;

  private constructor() {
    const adapter = new FileSync(this.JSON_DB_FILE);
    this.db = lowdb(adapter);
    this.db.defaults(INITIAL_DB).write();
  }

  public static get() {
    if (typeof DBMgr.instance === 'undefined') {
      DBMgr.instance = new DBMgr();
    }
    return DBMgr.instance;
  }

  public getVideoByVideoID(videoID: string): IVideo | null {
    return this.db.get(TABLE_VIDEOS)
      .find({ id: videoID })
      .value();
  }

  public getAllVideos(deepClone = false): IVideo[] {
    let videos = this.db.get(TABLE_VIDEOS)
      .sortBy(ATTR_PUBLISHED);
    if (deepClone) {
      videos = videos.cloneDeep();
    }
    return videos.reverse().value();
  }

  public getAllWatchedIds(): string[] {
    return this.db.get(TABLE_WATCHED).value();
  }

  public getUnwatchedVideos(): IVideo[] {
    const allVideos = this.getAllVideos(true).filter(video => !video.watched);
    const allWatchedIDs = this.getAllWatchedIds();
    return allVideos.filter(video => !allWatchedIDs.includes(video.id));
  }

  public addVideo(video: IVideo): void {
    this.addVideos([video]);
  }
  public addVideos(videos: IVideo[]): void {
    this.db.get(TABLE_VIDEOS).push(...videos).write();
  }
  public filterNewVideos(videos: IVideo[]): IVideo[] {
    const existingVideoIDs = this.db.get(TABLE_VIDEOS).value().map(video => video.id);
    const newVideos = videos.filter(newVideo => !existingVideoIDs.includes(newVideo.id));
    return newVideos;
  }

  public removeVideo(id: string): void {
    this.removeVideos([id]);
  }
  public removeVideos(ids: string[]): void {
    this.db.get(TABLE_VIDEOS).remove((video) => ids.includes(video.id)).write();
  }

  public videoWatched(videoID: string) {
    this.db.get(TABLE_WATCHED).push(videoID).write();
    this.db.get(TABLE_VIDEOS).remove({id: videoID}).write();
  }
}
