import { VideosResource } from './mgr/youtube/VideosResource';
import * as express from 'express';
import * as BodyParser from 'body-parser';
import * as cors from 'cors';

const videosResource: VideosResource = new VideosResource();

const app = express();
const port = 45012;

app.use(cors());
app.use(express.json());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'));

app.get('/videos',function(req,res) {
  const notificationsRO = videosResource.getUnwatchedVideos();
  res.json(notificationsRO);
});

app.get('/wached/:videoid',function(req,res) {
  const notificationsRO = videosResource.videoWatched(req.params.videoid);
  res.json(notificationsRO);
});

app.get('/test',function(req,res) {
  // const dbMgr = DBMgr.get();
  /*
  dbMgr.addNotifications([
    {date: '1', id: '1', videoID: '1'},
    {date: '2', id: '2', videoID: '2'},
    {date: '3', id: '3', videoID: '3'}
  ]);
  dbMgr.removeNotifications([{date: '1', id: '1', videoID: '1'},{date: '3', id: '3', videoID: '3'}]);
  dbMgr.removeNotification({date: '2', id: '2', videoID: '2'});
  console.log(dbMgr.getNotifications());
  */
  res.send();
});

app.listen(port, () => console.log(`Youtube4Me api listening on port ${port}!`));

// Prefetch the notifications to speed up api requests to this server
videosResource.startPrefetchLoop();