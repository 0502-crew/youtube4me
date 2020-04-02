import { OAuth2Client } from 'google-auth-library';
import { google, youtube_v3 } from 'googleapis';
import { IVideoDetails, IThumbnail } from '../db/INotification';
import { CONFIG } from '../../config/Config';
import { Utils } from '../../util/Utils';

export class YoutubeService {
  private youtube: youtube_v3.Youtube;

  constructor() {
    const oAuth2Client = new OAuth2Client(CONFIG.authData);
    oAuth2Client.setCredentials(CONFIG.youtubeTokens);
    this.youtube = google.youtube({
      version: 'v3',
      auth: oAuth2Client
    });
  }

  public async getVideoDetails(ids: string | string[])  {
    if (typeof ids === 'string') {
      ids = [ids];
    }
    /**
     * Call has a limit of 50 videos per call
     */
    const videoDetailsMap: {[id: string]: IVideoDetails} = {};
    await Promise.all(Utils.chunk(ids, 50).map(fiftyIds => {
      return this.youtube.videos.list({
        part: 'id, contentDetails, snippet',
        id: fiftyIds.join(',')
      }).then(response => {
        response.data.items?.map(video => {

          /**
           * Parse the duration.
           * Example PT5H57M51S = 5 hours 57 minutes 51 seconds
           * But it does not have a value if the value is 0. Eg. PT5H51S = 5 hours 0 minutes 51 seconds
           */
          let duration = video.contentDetails?.duration as string;
          let hours = '00';
          let minutes = '00';
          let seconds = '00';
          duration = duration.replace('PT', '');
          const hoursIndex = duration.indexOf('H') as number;
          if (hoursIndex > -1) {
            hours = duration.substr(0, hoursIndex);
            if (hours.length === 1) {
              hours = '0' + hours;
            }
            duration = duration.slice(hoursIndex+1);
          }
          const minutesIndex = duration.indexOf('M');
          if (minutesIndex > -1) {
            minutes = duration.substr(0, minutesIndex);
            if (minutes.length === 1) {
              minutes = '0' + minutes;
            }
            duration = duration.slice(minutesIndex+1);
          }
          const secondsIndex = duration.indexOf('S');
          if (secondsIndex > -1) {
            seconds = duration.substr(0, secondsIndex);
            if (seconds.length === 1) {
              seconds = '0' + seconds;
            }
            duration = duration.slice(secondsIndex+1);
          }
          videoDetailsMap[video.id as string] = {
            id: video.id as string,
            publishedAt: video.snippet?.publishedAt as string,
            title: video.snippet?.title as string,
            description: video.snippet?.description as string,
            thumbnails: {
              default: video.snippet?.thumbnails?.default as IThumbnail,
              medium: video.snippet?.thumbnails?.medium as IThumbnail,
              high: video.snippet?.thumbnails?.high as IThumbnail,
              standard: video.snippet?.thumbnails?.standard as IThumbnail,
              maxres: video.snippet?.thumbnails?.maxres as IThumbnail,
            },
            channelId: video.snippet?.channelId as string,
            channelTitle: video.snippet?.channelTitle as string,
            duration: {
              hours,
              minutes,
              seconds,
            },
            caption: video.contentDetails?.caption === 'true',
          };
        });
      });
    }));
    return videoDetailsMap;
  }
}