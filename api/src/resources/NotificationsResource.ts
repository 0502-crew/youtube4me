import { GmailMgr, LABELS } from '@src/mgr/google-api/GmailMgr';
import { DBMgr } from '@src/mgr/db/DbMgr';

export class NotificationsResource {
  private gmailMgr = new GmailMgr();
  private dbMgr = DBMgr.get();

  public async getAllNotifications(): Promise<string[]> {
    const messages = await this.gmailMgr.getEmailsByLabel(LABELS.YTNew);
    // Make deep clone so that the list can be edited
    const allDBNotifications = this.dbMgr.getNotifications(true);
    /*
     * Filter out the messages that exist in the DB so that only new ones make calls to google API (saves resources)
     * Remove the notifications from the DB that no longer exist in the messages (messages is master)
     */
    messages.filter(message => this.dbMgr.getNotificationByVideoID(message.) != null)
    allDBNotifications.filter(notification => )

    const videoIds: string[] = [];
    messages.map(message => {
      const videoId = this.gmailMgr.extractYoutubeVideoIDFromEmail(message);
      if (videoId !== null) {
        videoIds.push(videoId);
      }
    });
    return videoIds;
  }
}