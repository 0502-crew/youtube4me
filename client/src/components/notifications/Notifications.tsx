import './Notifications.css';

import * as React from 'react';
import * as bent from 'bent';
import { INotification } from '@src/models/api/INotification';
import { NotificationsRO } from '@src/models/api/NotificationsRO';
import { PageNavigation } from '../page-navigation/PageNavigation';
import { Notification } from '../notification/Notification';

interface NotificationsState {
  notifications: INotification[]
}
interface NotificationsProps {
  
}

export class Notifications extends React.Component<NotificationsProps, NotificationsState> {
  private currentPage = 0;
  private lastPage = 0;
  private hostname = window.location.hostname;

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
      const notificationsRO: NotificationsRO = await bent('json')(`http://${this.hostname}:45012/notifications/${this.currentPage}`) as NotificationsRO;
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
        <PageNavigation currentPage={this.currentPage} lastPage={this.lastPage} onClickPrev={this.prevPage} onClickNext={this.nextPage} />
        {
          this.state.notifications.map((notification, index) => (
            <Notification key={index} notification={notification} />
          ))
        }
        <PageNavigation currentPage={this.currentPage} lastPage={this.lastPage} onClickPrev={this.prevPage} onClickNext={this.nextPage} />
      </div>
    );
  }

}