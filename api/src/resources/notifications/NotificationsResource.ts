import { GmailMgr, LABELS } from '@src/mgr/google-api/GmailMgr';
import { DBMgr } from '@src/mgr/db/DbMgr';
import { INotification } from '@src/mgr/db/IDatabase';
import { YoutubeMgr } from '@src/mgr/google-api/YoutubeMgr';
import { NotificationsRO } from './NotificationsRO';
import { Utils } from '@src/util/Utils';

export class NotificationsResource {
  private gmailMgr = new GmailMgr();
  private youtubeMgr = new YoutubeMgr();
  private dbMgr = DBMgr.get();

  public async getAllNotifications(page: number = 0): Promise<NotificationsRO> {
    const allDBNotifications = this.dbMgr.getNotifications(true);
    const notificationPages = Utils.chunk(allDBNotifications, 10);
    if(notificationPages.length === 0) {
      return {
        currentPage: 0,
        lastPage: 0,
        notifications: []
      }
    } else {
      if (page < 0) {
        page = 0;
      } else if(page >= notificationPages.length) {
        page = notificationPages.length -1;
      }
      return {
        currentPage: page,
        lastPage: notificationPages.length -1,
        notifications: notificationPages[page]
      }
    }
  }

  /**
   * Prefetch the notifications every minute.
   * When the notifications are requested from this api, it will return what has been prefetched instead of making a call to google in real time
   */
  public startPrefetchLoop() {
    this.updateNotifications().then(() => {
      setTimeout(() => {
        this.startPrefetchLoop();
      }, 60000);
    });
  }

  public async updateNotifications(): Promise<void> {
    const startTime = Date.now();
    const messages = await this.gmailMgr.getEmailsByLabel(LABELS.YTNew);
    // Make deep clone so that the list can be edited
    let allDBNotifications = this.dbMgr.getNotifications(true);
    /*
     * Filter out the messages that don't exist in the DB yet so that only new ones make calls to google API (saves resources)
     * Remove the notifications from the DB that no longer exist in the messages (messages is master)
     */
    const newMessages = messages.filter(message => typeof allDBNotifications.find(notification => notification.id === message.id) === 'undefined');
    const deletedNotifications = allDBNotifications.filter(notification => typeof messages.find(message => notification.id === message.id) === 'undefined');
    this.dbMgr.removeNotifications(deletedNotifications);

    const newNotifications: INotification[] = [];
    const messageVideoIDs = newMessages.map(message => {
      return {message: message, videoID: this.gmailMgr.extractYoutubeVideoIDFromEmail(message) as string}
    }).filter(x => x.videoID !== null);
    const videoDetailsMap = await this.youtubeMgr.getVideoDetails(messageVideoIDs.map(x => x.videoID));
    messageVideoIDs.map(messageVideoID => {
      newNotifications.push({
        id: messageVideoID.message.id as string,
        date: messageVideoID.message.internalDate as string,
        videoDetails: videoDetailsMap[messageVideoID.videoID]
      });
    });
    this.dbMgr.addNotifications(newNotifications);
    console.log(`Added ${newNotifications.length} notifications to DB and deleted ${deletedNotifications.length} in ${(Date.now() - startTime)/1000} seconds`);
  }
}