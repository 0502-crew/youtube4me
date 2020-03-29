import { NotificationsResource } from './resources/NotificationsResource';

const express = require('express');
const BodyParser = require('body-parser');
const app = express();
const port = 45012;
const cors = require("cors");

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));