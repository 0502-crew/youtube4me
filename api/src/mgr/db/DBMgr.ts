import * as path from 'path';
import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import { INITIAL_DB, IDatabase, VIDEOS, PUBLISHED } from './IDatabase';
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

  public getVideoByVideoID(videoID: string): IVideo|null {
    return this.db.get(VIDEOS)
      .find({id: videoID})
      .value();
  }
  
  public getAllVideos(deepClone = false): IVideo[] {
    let videos = this.db.get(VIDEOS)
      .sortBy(PUBLISHED);
    if (deepClone) {
      videos = videos.cloneDeep();
    }
    return videos.reverse().value();
  }

  public getUnwatchedVideos(): IVideo[] {
    return this.getAllVideos(true).filter(video => !video.watched);
  }

  public addVideo(video: IVideo): void {
    this.addVideos([video]);
  }
  public addVideos(videos: IVideo[]): void {
    this.db.get(VIDEOS).push(...videos).write();
  }
  public mergeNewVideos(videos: IVideo[]): Number {
    const existingVideoIDs = this.db.get(VIDEOS).value().map(video => video.id);
    const newVideos = videos.filter(newVideo => !existingVideoIDs.includes(newVideo.id));
    this.addVideos(newVideos);
    return newVideos.length;
  }
  
  public removeVideo(id: string): void {
    this.removeVideos([id]);
  }
  public removeVideos(ids: string[]): void {
    this.db.get(VIDEOS).remove((video) => ids.includes(video.id)).write();
  }

  public videoWatched(videoID: string) {
    this.db.get(VIDEOS)
      .find({id: videoID})
      .assign({watched: true})
      .value();
  }
  
  public cleanOldWatchedVideos(recentVideoIDs: string[]): void {
    this.db.get(VIDEOS).remove((video) => video.watched && !recentVideoIDs.includes(video.id)).write();
  }

}
