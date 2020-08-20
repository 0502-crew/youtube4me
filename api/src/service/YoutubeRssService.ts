import path = require('path');
import fs = require('fs');
import { IVideo } from '@src/resources/feed/IVideo';
var xml2js = require('xml2js');
const fetch = require('node-fetch');

export class YoutubeRssService {
  public async getAllVideos() {
    let subscriptionsXml = fs.readFileSync(path.resolve(process.cwd(), 'subscriptions.xml'), 'utf8');
    const subscriptions = await xml2js.parseStringPromise(subscriptionsXml, {trim: true, mergeAttrs: true});
    const urls = subscriptions.opml.body[0].outline[0].outline.map(entry => entry.xmlUrl[0]);
    const data = await Promise.all(urls.map(url => this.fetchUrl(url)));
    const videosArray: IVideo[][] = await Promise.all(data.map(feedXml => this.parseFeed(feedXml)));
    const videos: IVideo[] = Array.prototype.concat(...videosArray);
    return videos;
  }

  private async fetchUrl(url: string): Promise<any> {
    const response = await fetch(url);
    return await response.text();
  }

  private async parseFeed(feedXml): Promise<IVideo[]> {
    const feed = await xml2js.parseStringPromise(feedXml, {trim: true, mergeAttrs: true});
    const channelName = feed.feed.title[0];
    const channelID = feed.feed['yt:channelId'][0];
    return feed.feed.entry.map((entry: any): IVideo => {
      return {
        channelID,
        channelName,
        id: entry['yt:videoId'][0],
        link: entry.link[0].href[0],
        title: entry.title[0],
        published: entry.published[0],
        thumbnail: entry['media:group'][0]['media:thumbnail'][0].url[0],
        description: entry['media:group'][0]['media:description'][0],
      };
    });
  }
}