import { OAuth2Client } from 'google-auth-library';
import { google, gmail_v1 } from 'googleapis';
import { CONFIG } from '~/config/Config';

export enum LABELS {
  YTNew = 'YTNew',
}

export class GmailService {
  private gmail: gmail_v1.Gmail;

  constructor() {
    const oAuth2Client = new OAuth2Client(CONFIG.authData);
    oAuth2Client.setCredentials(CONFIG.gmailTokens);
    this.gmail = google.gmail({
      version: 'v1',
      auth: oAuth2Client
    });
  }

  public async getEmailsByLabel(labelName: string): Promise<gmail_v1.Schema$Message[]> {
    try {
      const labelsResult = await this.gmail.users.labels.list({
        userId: 'me',
      });
      if (typeof labelsResult.data.labels !== 'undefined') {
        const label = labelsResult.data.labels.find((label) => label.name === labelName);
        if (typeof label !== 'undefined') {
          const messagesResult = await this.gmail.users.messages.list({
            labelIds: [label.id as string],
            userId: 'me'
          });
          const messages = messagesResult.data.messages;
          if (typeof messages !== 'undefined') {
            const emails: gmail_v1.Schema$Message[] = [];
            messages.sort(function(a, b){return Number(b.internalDate) - Number(a.internalDate)});
            await Promise.all(messages.map(message =>
              this.getEmailById(message.id as string).then(emailResult => {
                emails.push(emailResult.data);
              })
            ));
            
            // Return all the emails found
            return emails;
          } else {
            throw new Error("Failed to find emails by label " + label);
          }
        } else {
          throw new Error("Failed to find label " + label);
        }
      } else {
        throw new Error("Failed to fetch labels");
      }

    } catch (e) {
      console.log(e);
    }
    return [];
  }

  public async getEmailById(id: string) {
    return await this.gmail.users.messages.get({
      id,
      userId: 'me'
    });
  }

  public getEmailPlainTextBody(email: gmail_v1.Schema$Message): string {
    if (typeof email.payload !== 'undefined'
        && typeof email.payload.parts !== 'undefined'
        && typeof email.payload.parts[0].body !== 'undefined'
        && typeof email.payload.parts[0].body.data !== 'undefined'
        && email.payload.parts[0].body.data !== null) {
      return Buffer.from(email.payload.parts[0].body.data, "base64").toString();
    }
    return '';
  }

  public extractYoutubeVideoIDFromEmail(email: gmail_v1.Schema$Message): string|null {
    const mailBody = this.getEmailPlainTextBody(email);
    const urlLine = mailBody.split('\n').find((line) => line.includes('www.youtube.com/watch?v='));
    if (typeof urlLine !== 'undefined' && urlLine) {
      const startIndex = urlLine.indexOf('?v=') + 3;
      if (startIndex === -1 + 3) {
        return null;
      }
      let endIndex = urlLine.indexOf('&', startIndex);
      if (endIndex === -1) {
        endIndex = urlLine.length;
      }
      return urlLine.substring(startIndex, endIndex);
    } else {
      return null;
    }
  }

  public async getAllLabels(): Promise<gmail_v1.Schema$Label[]> {
    try {
      const response = await this.gmail.users.labels.list({
        userId: 'me'
      });
      const labels = response.data.labels;
      if (typeof labels !== 'undefined') {
        return labels;
      }
    } catch(e) {
      console.log(e);
    }
    return [];
  }

  public async removeLabels(messageId: string, labels: string[]) {
    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {removeLabelIds: labels}
      });
    } catch(e) {
      console.log(e);
    }
  }
}