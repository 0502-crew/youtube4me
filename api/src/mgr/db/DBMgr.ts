import * as path from 'path';
import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import { INITIAL_DB, INotification, NOTIFICATIONS, NOTIFICATION_DATE, NOTIFICATION_VIDEO_ID, IDatabase } from './IDatabase';

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

  public getNotificationByVideoID(videoID: string): INotification|null|undefined {
    const results: INotification[] = this.db.get(NOTIFICATIONS)
      .filter((notification) => notification.videoDetails.id === videoID)
      .value();
    return results.length === 0 ? null : results[0];
  }
  
  public getNotifications(deepClone = false): INotification[] {
    let notifications = this.db.get(NOTIFICATIONS)
      .sortBy(NOTIFICATION_DATE);
    if (deepClone) {
      notifications = notifications.cloneDeep();
    }
    return notifications.reverse().value();
  }

  public addNotification(notification: INotification): void {
    this.addNotifications([notification]);
  }
  public addNotifications(notifications: INotification[]): void {
    this.db.get(NOTIFICATIONS).push(...notifications).write();
  }
  
  public removeNotification(notification: INotification): void {
    this.removeNotifications([notification]);
  }
  public removeNotifications(notifications: INotification[]): void {
    const ids = notifications.map(n => n.id);
    this.db.get(NOTIFICATIONS).remove((x) => ids.includes(x.id)).write();
  }

}
