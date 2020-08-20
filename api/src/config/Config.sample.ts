/**
 * Copy this file to Config.ts (is in gitignore because it contains private data)
 * 
 * 1) Go to https://console.developers.google.com/apis/credentials and create a project in the top left corner and select it
 * 2) Go to the above url again and create a new "OAuth 2.0 Client IDs" entry of type "Web application"
 * 3) Note the client_id and secret_id and add them to the authData section of config.ts
 * 4) Go to https://console.developers.google.com/apis/library and make sure the project is still selected in the top left. Now enable API for "Gmail API" and "YouTube Data API v3"
 *    (maybe more APIs if this guide becomes outdated)
 * 5) Perform these steps twice, once for youtube and once for gmail. The ycan be combined into one token pair IF they are the exact same account.
 *    Remember that your youtube account may have multiple users and you may be using a user from before youtube was merged into google. In this case, 2 token pairs are needed.
 *      a) Go to https://developers.google.com/oauthplayground
 *      b) Click the cog icon to open the "OAuth 2.0 configuration" menu. Check "Use your own OAuth credentials" and add the client id and secret from step (3)
 *      c) In the list on the left, check "Gmail API" -> "https://www.googleapis.com/auth/gmail.modify" or "Youtube Data API v3" -> "https://www.googleapis.com/auth/youtube"
 *         Remember that this might need to be split into 2 separate token pairs
 *      d) Click authorize APIs
 *      e) Click the "exchange" button
 *      f) Note the refresh and access tokens and add them to the gmailTokens and youtubeTokens sections of config.ts
 *         The access token will expire after an hour but the refresh token never does. The google api code automatically refreshes the token so this setup needs to only be done once.
 */
 
import {IConfig} from './IConfig';

export const CONFIG: IConfig = {
  blacklist: [
    {
      name: "1theK Originals - 원더케이 오리지널",
      id: "UCqq-ovGE01ErlXakPihhKDA",
    },
  ],
  /* D-Day for email notifications */
  fromDate: "2020-08-13T00:00:00+00:00",
}