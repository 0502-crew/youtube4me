import { NotificationsResource } from './resources/NotificationsResource';
import { DBMgr } from './mgr/db/DbMgr';
import * as express from 'express';
import * as BodyParser from 'body-parser';
import * as cors from 'cors';

const app = express();
const port = 45012;

app.use(cors());
app.use(express.json());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'));

app.get('/notifications',function(req,res) {
  (async () => {
    const videoIds = await new NotificationsResource().getAllNotifications();
    res.json(videoIds);
  })();
});

app.get('/test',function(req,res) {
  const dbMgr = DBMgr.get();
  res.send();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));