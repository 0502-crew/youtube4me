export interface IConfig {
  blacklist: IChannel[];
  fromDate: string;
}

export interface IChannel {
  name: string,
  id: string,
}