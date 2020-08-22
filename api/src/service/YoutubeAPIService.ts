import { CONFIG } from '@src/config/Config';
import { IVideo, IDuration } from '@src/resources/feed/IVideo';
const fetch = require('node-fetch');

export class YoutubeAPIService {
  private API_BASE_URL: string = "https://www.googleapis.com/youtube/v3/";
  private VIDEOS_PATH_AND_PARAMS: string = "videos?part=contentDetails&key=" + CONFIG.googleAPIKey+ "&id=";
  private MAX_IDS: number = 50;

  public async setVideoDurations(videos: IVideo[]): Promise<void> {
    var firstIndex: number = 0;
    var lastIndex: number = 0;
    if(videos.length > 0) {
      while (lastIndex < videos.length) {
        lastIndex = Math.min(videos.length, firstIndex + this.MAX_IDS);
        const currentVideos = videos.slice(firstIndex, lastIndex);
        const url = this.API_BASE_URL + this.VIDEOS_PATH_AND_PARAMS + currentVideos.map(video => video.id).join(',');
        const durationTuples: [string, string][] = await new Promise<[string, string][]>((resolve, reject) => {
          fetch(url)
            .then(response => response.text())
            .then(responseText => {
              resolve(JSON.parse(responseText).items.map(item => [item.id, item.contentDetails.duration]));
            })
        });
        durationTuples.map(durationTuple => {
          currentVideos.filter(video => video.id === durationTuple[0])[0].duration = this.parseDuration(durationTuple[1]);
        });
        firstIndex = lastIndex;
      }
    }
  }

  private parseDuration(durationString: string): IDuration {
    /**
     * Parse the duration.
     * Example PT5H57M51S = 5 hours 57 minutes 51 seconds
     * But it does not have a value if the value is 0. Eg. PT5H51S = 5 hours 0 minutes 51 seconds
     */
    let hours = '00';
    let minutes = '00';
    let seconds = '00';
    durationString = durationString.replace('PT', '');
    const hoursIndex = durationString.indexOf('H') as number;
    if (hoursIndex > -1) {
      hours = durationString.substr(0, hoursIndex);
      if (hours.length === 1) {
        hours = '0' + hours;
      }
      durationString = durationString.slice(hoursIndex+1);
    }
    const minutesIndex = durationString.indexOf('M');
    if (minutesIndex > -1) {
      minutes = durationString.substr(0, minutesIndex);
      if (minutes.length === 1) {
        minutes = '0' + minutes;
      }
      durationString = durationString.slice(minutesIndex+1);
    }
    const secondsIndex = durationString.indexOf('S');
    if (secondsIndex > -1) {
      seconds = durationString.substr(0, secondsIndex);
      if (seconds.length === 1) {
        seconds = '0' + seconds;
      }
      durationString = durationString.slice(secondsIndex+1);
    }

    return {hours, minutes, seconds};
  }
}