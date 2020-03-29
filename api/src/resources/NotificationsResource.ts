import { GmailMgr, LABELS } from '@src/mgr/google-api/GmailMgr';

export class NotificationsResource {
  private gmailMgr = new GmailMgr();

  public async getAllNotifications(): Promise<string[]> {
    const messages = await this.gmailMgr.getEmailsByLabel(LABELS.YTNew);
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