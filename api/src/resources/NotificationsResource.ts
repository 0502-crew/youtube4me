import { GmailMgr, LABELS } from '@src/mgr/google-api/GmailMgr';
import { DBMgr } from '@src/mgr/db/DbMgr';
import { INotification } from '@src/mgr/db/IDatabase';
import { YoutubeMgr } from '@src/mgr/google-api/YoutubeMgr';

export class NotificationsResource {
  private gmailMgr = new GmailMgr();
  private youtubeMgr = new YoutubeMgr();
  private dbMgr = DBMgr.get();

  public async getAllNotifications(): Promise<INotification[]> {
    const messages = await this.gmailMgr.getEmailsByLabel(LABELS.YTNew);
    // Make deep clone so that the list can be edited
    const allDBNotifications = this.dbMgr.getNotifications(true);
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
    // console.log(videoDetailsMap);
    messageVideoIDs.map(messageVideoID => {
      newNotifications.push({
        id: messageVideoID.message.id as string,
        date: messageVideoID.message.internalDate as string,
        videoDetails: videoDetailsMap[messageVideoID.videoID]
      });
    });
    this.dbMgr.addNotifications(newNotifications);
    return this.dbMgr.getNotifications(true);
  }
}