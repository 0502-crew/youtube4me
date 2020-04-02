import * as path from 'path';
import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import { INITIAL_DB, NOTIFICATIONS, NOTIFICATION_DATE, NOTIFICATION_VIDEO_ID, IDatabase } from './IDatabase';
import { INotification } from './INotification';

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

  public getNotificationByVideoID(videoID: string): INotification|null {
    const results: INotification[] = this.db.get(NOTIFICATIONS)
      .filter((notification) => notification.videoDetails.id === videoID)
      .value();
    return results.length === 0 ? null : results[0];
  }
  
  public getNotificationByMessageId(messageId: string): INotification|null {
    const results: INotification[] = this.db.get(NOTIFICATIONS)
      .filter((notification) => notification.messageId === messageId)
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
  
  public removeNotification(messageId: string): void {
    this.removeNotifications([messageId]);
  }
  public removeNotifications(messageIds: string[]): void {
    this.db.get(NOTIFICATIONS).remove((notification) => messageIds.includes(notification.messageId)).write();
  }

}
