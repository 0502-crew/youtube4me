import { GmailService, LABELS } from '@src/mgr/google-api/GmailService';
import { DBMgr } from '@src/mgr/db/DbMgr';
import { YoutubeService } from '@src/mgr/google-api/YoutubeService';
import { NotificationsRO } from './NotificationsRO';
import { INotification } from '@src/mgr/db/INotification';
import { gmail_v1 } from 'googleapis';

export class NotificationsResource {
  private gmailMgr = new GmailService();
  private youtubeMgr = new YoutubeService();
  private dbMgr = DBMgr.get();
  private gmailLabels: gmail_v1.Schema$Label[];

  public getAllNotifications(): NotificationsRO {
    return {
      notifications: this.dbMgr.getNotifications(true)
    };
  }

  /**
   * Prefetch the notifications every minute.
   * When the notifications are requested from this api, it will return what has been prefetched instead of making a call to google in real time
   */
  public async startPrefetchLoop() {
    await this.updateNotifications();
    this.gmailLabels = await this.gmailMgr.getAllLabels();
    setTimeout(() => {
      this.startPrefetchLoop();
    }, 60000);
  }

  public async updateNotifications(): Promise<void> {
    const startTime = Date.now();
    const messages = await this.gmailMgr.getEmailsByLabel(LABELS.YTNew);
    // Make deep clone so that the list can be edited
    let allDBNotifications = this.dbMgr.getNotifications(true) as INotification[];
    /*
     * Filter out the messages that don't exist in the DB yet so that only new ones make calls to google API (saves resources)
     * Remove the notifications from the DB that no longer exist in the messages (messages is master)
     */
    const newMessages = messages.filter(message => typeof allDBNotifications.find(notification => notification.messageId === message.id) === 'undefined');
    const deletedNotifications = allDBNotifications.filter(notification => typeof messages.find(message => notification.messageId === message.id) === 'undefined');
    this.dbMgr.removeNotifications(deletedNotifications.map(notification => notification.messageId));

    const newNotifications: INotification[] = [];
    const messageVideoIDs = newMessages.map(message => {
      return {message: message, videoID: this.gmailMgr.extractYoutubeVideoIDFromEmail(message) as string}
    }).filter(x => x.videoID !== null);
    const videoDetailsMap = await this.youtubeMgr.getVideoDetails(messageVideoIDs.map(x => x.videoID));
    messageVideoIDs.map(messageVideoID => {
      newNotifications.push({
        messageId: messageVideoID.message.id as string,
        date: messageVideoID.message.internalDate as string,
        videoDetails: videoDetailsMap[messageVideoID.videoID]
      });
    });
    this.dbMgr.addNotifications(newNotifications);
    console.log(`Added ${newNotifications.length} notifications to DB and deleted ${deletedNotifications.length} in ${(Date.now() - startTime)/1000} seconds`);
  }

  public async deleteNotification(messageId: string) {
    const labels = this.gmailLabels.filter(label => label.name === LABELS.YTNew).map(label => label.id as string);
    await this.gmailMgr.removeLabels(messageId, labels);
    this.dbMgr.removeNotification(messageId);
  }
}