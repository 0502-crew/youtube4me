export interface IConfig {
  authData: {
    clientId: string,
    clientSecret: string,
    redirectUri: string,
  },
  gmailTokens: {
    access_token: string, 
    refresh_token: string,
  },
  youtubeTokens: {
    access_token: string, 
    refresh_token: string,
  }
}