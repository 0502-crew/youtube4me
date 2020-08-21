import { DBMgr } from '../db/DBMgr';
import { VideoRO } from './VideoRO';
import { YoutubeRssService } from '@src/service/YoutubeRssService';
import { IVideo } from '@src/resources/feed/IVideo';
import { CONFIG } from '@src/config/Config';

export class VideosResource {
  private dbMgr = DBMgr.get();

  public getUnwatchedVideos(): VideoRO {
    return {
      videos: this.dbMgr.getUnwatchedVideos()
    };
  }

  /**
   * Prefetch the notifications every minute.
   * When the notifications are requested from this api, it will return what has been prefetched instead of making a call to google in real time
   */
  public async startPrefetchLoop() {
    await this.updateVideos();
    setTimeout(() => {
      this.startPrefetchLoop();
    }, 60000);
  }

  public async updateVideos(): Promise<void> {
    const startTime = Date.now();

    const ytService = new YoutubeRssService();
    let recentVideos: IVideo[] = await ytService.getAllVideos();
    const recentVideoIDs = recentVideos.map(video => video.id);
    if(recentVideos.length > 0) {
      this.dbMgr.cleanOldWatchedVideos(recentVideoIDs, ytService.getBlacklist());
      const count = this.dbMgr.mergeNewVideos(recentVideos);
      console.log(`Added ${count} videos to DB in ${(Date.now() - startTime)/1000} seconds`);
    }
  }

  public videoWatched(videoID: string) {
    this.dbMgr.videoWatched(videoID);
  }
}