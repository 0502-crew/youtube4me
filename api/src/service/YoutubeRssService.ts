import path = require('path');
import fs = require('fs');
import { IVideo } from '@src/resources/feed/IVideo';
import { IChannel } from '@src/config/IConfig';
var xml2js = require('xml2js');
const fetch = require('node-fetch');

export class YoutubeRssService {
  private blacklist: string[];

  constructor() {
    const blacklistText = fs.readFileSync(path.resolve(process.cwd(), 'ytfeed/blacklist.json'), 'utf8');
    this.blacklist = JSON.parse(blacklistText).map((channel: IChannel) => channel.id);
  }

  public getBlacklist(): string[] {
    return this.blacklist;
  }

  public async getAllVideos(): Promise<IVideo[]> {
    let subscriptionsXml = fs.readFileSync(path.resolve(process.cwd(), 'ytfeed/subscriptions.xml'), 'utf8');
    const subscriptions = await xml2js.parseStringPromise(subscriptionsXml, {trim: true, mergeAttrs: true});
    // Array of urls to channel feeds
    const urls: string[] = subscriptions.opml.body[0].outline[0].outline.map(entry => entry.xmlUrl[0]);
    // Array of XML strings of the feed for each individual channel
    const data: string[] = await Promise.all(urls.map(url => this.fetchUrl(url)));
    // Array of Arrays of IVideos for each separate channel
    const videosArray: IVideo[][] = await Promise.all(data.map(feedXml => this.parseFeed(feedXml)));
    // Array of all IVideos of all channels combined
    const videos: IVideo[] = Array.prototype.concat(...videosArray);
    return videos;
  }

  private async fetchUrl(url: string): Promise<string> {
    const response = await fetch(url);
    return await response.text();
  }

  private async parseFeed(feedXml: string): Promise<IVideo[]> {
    try {
      const feed = await xml2js.parseStringPromise(feedXml, {trim: true, mergeAttrs: true});
      const channelName = feed.feed.title[0];
      const channelID = feed.feed['yt:channelId'][0];
      if(this.getBlacklist().includes(channelID)) {
        return [];
      } else {
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
    } catch(error) {
      console.log('Error trying to parse xml:\n' + feedXml + '\n' + error);
      return Promise.resolve([]);
    }
  }
}