import { DBMgr } from '../db/DBMgr';
import { VideoRO } from './VideoRO';
import { YoutubeRssService } from '@src/service/YoutubeRssService';
import { IVideo } from '@src/resources/feed/IVideo';
import { YoutubeAPIService } from '@src/service/YoutubeAPIService';

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
    if(recentVideos.length > 0) {
      const recentVideoIDs = recentVideos.map(video => video.id);
      this.dbMgr.cleanOldWatchedVideos(recentVideoIDs, ytService.getBlacklist());
      const newVideos = this.dbMgr.filterNewVideos(recentVideos);
      await new YoutubeAPIService().setVideoDurations(newVideos);
      this.dbMgr.addVideos(newVideos);
      console.log(`Added ${newVideos.length} videos to DB in ${(Date.now() - startTime)/1000} seconds`);
    }
  }

  public videoWatched(videoID: string) {
    this.dbMgr.videoWatched(videoID);
  }
}