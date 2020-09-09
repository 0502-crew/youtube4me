export interface IVideo {
  channelName: string,
  channelID: string,
  id: string,
  link: string,
  title: string,
  published: string,
  thumbnail: string,
  description: string,
  watched?: boolean,
  duration?: IDuration,
  added?: Date
}

export interface IDuration {
  hours: string,
  minutes: string,
  seconds: string,
}