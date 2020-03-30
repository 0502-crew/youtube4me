import { OAuth2Client } from 'google-auth-library';
import { CONFIG } from '@src/config/Config';
import { google, youtube_v3 } from 'googleapis';
import { IVideoDetails, IThumbnail } from '../db/IDatabase';

export class YoutubeMgr {
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
    await Promise.all(this.chunk(ids, 50).map(fiftyIds => {
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
          let hours = 0;
          let minutes = 0;
          let seconds = 0;
          duration = duration.replace('PT', '');
          const hoursIndex = duration.indexOf('H') as number;
          if (hoursIndex > -1) {
            hours = Number(duration.substr(0, hoursIndex));
            duration = duration.slice(0, hoursIndex);
          }
          const minutesIndex = duration.indexOf('M') as number;
          if (minutesIndex > -1) {
            hours = Number(duration.substr(0, minutesIndex));
            duration = duration.slice(0, minutesIndex);
          }
          const secondsIndex = duration.indexOf('S') as number;
          if (secondsIndex > -1) {
            hours = Number(duration.substr(0, secondsIndex));
            duration = duration.slice(0, secondsIndex);
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
    
    console.log(videoDetailsMap);
    return videoDetailsMap;
  }

  private chunk(array: any[], size: number) {
    const chunkedArray: any[] = [];
    let index = 0;
    while (index < array.length) {
      chunkedArray.push(array.slice(index, size + index));
      index += size;
    }
    return chunkedArray;
  }
}