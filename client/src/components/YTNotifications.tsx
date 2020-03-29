import * as React from 'react';
import * as bent from 'bent';

interface YTNotificationsState {
  videoIDs: string[]
}
interface YTNotificationsProps {
  
}

export class YTNotifications extends React.Component<YTNotificationsProps, YTNotificationsState> {

  constructor(props: YTNotificationsProps) {
    super(props);
    this.state = {
      videoIDs: []
    }
  }

  componentDidMount() {
    (async () => {
      const videoIDs = await bent('json')('http://localhost:45012/notifications');
      this.setState({videoIDs});
    })();
  }

  render(): React.ReactNode {
    return (
      <div>
        {this.state.videoIDs.map((videoID) => (
          <div> {videoID}</div>
        ))}
      </div>
    );
  }

}