import './Notifications.css';

import * as React from 'react';
import * as bent from 'bent';
import { INotification } from '@src/models/api/INotification';
import { NotificationsRO } from '@src/models/api/NotificationsRO';

interface NotificationsState {
  notifications: INotification[]
}
interface NotificationsProps {
  
}

export class Notifications extends React.Component<NotificationsProps, NotificationsState> {
  private currentPage = 0;
  private lastPage = 0;

  constructor(props: NotificationsProps) {
    super(props);
    this.state = {
      notifications: []
    }
  }

  componentDidMount() {
    this.getNotifications();
  }
  
  private getNotifications = () => {
    (async () => {
      const notificationsRO: NotificationsRO = await bent('json')(`http://localhost:45012/notifications/${this.currentPage}`);
      this.currentPage = notificationsRO.currentPage;
      this.lastPage = notificationsRO.lastPage;
      this.setState({notifications: notificationsRO.notifications});
    })();
  }

  private nextPage = () => {
    if(this.currentPage < this.lastPage) {
      this.currentPage++;
      this.getNotifications();
    }
  }

  private prevPage = () => {
    if(this.currentPage > 0) {
      this.currentPage--;
      this.getNotifications();
    }
  }

  render(): React.ReactNode {
    return (
      <div className='notifications'>
        <div className='page-navigation'>
          <span className='prev' onClick={this.prevPage}>prev</span>
          <span>{this.currentPage} of {this.lastPage}</span>
          <span className='next' onClick={this.nextPage}>next</span>
        </div>
        {
          this.state.notifications.map((notification, index) => (
            <div key={index} className='notification'>
              <a href={`https://www.youtube.com/watch?v=${notification.videoDetails.id}`} target="_blank">
                <img src={notification.videoDetails.thumbnails.medium.url} className='thumbnail desktop' style={{'height': notification.videoDetails.thumbnails.medium.height}} />
                <img src={notification.videoDetails.thumbnails.default.url} className='thumbnail mobile' style={{'height': notification.videoDetails.thumbnails.default.height}} />
                <div className='video-details'>
                  <div className='title'>
                    {notification.videoDetails.title}
                  </div>
                  <div className='description'>
                    {notification.videoDetails.description.split('\n').map((line, index) => <div key={index}>{line}</div>)}
                  </div>
                </div>
              </a>
            </div>
          ))
        }
      </div>
    );
  }

}