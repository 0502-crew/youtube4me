import './Notifications.css';

import * as React from 'react';
import * as bent from 'bent';
import { INotification } from '@src/models/api/INotification';
import { NotificationsRO } from '@src/models/api/NotificationsRO';
import { Notification } from '../notification/Notification';
import VisibilitySensor from 'react-visibility-sensor';
import { Utils } from '@src/utils/Utils';


interface NotificationsState {
  notifications: INotification[]
  totalShown: number;
}
interface NotificationsProps {
  
}

export class Notifications extends React.Component<NotificationsProps, NotificationsState> {
  private static readonly SHOWN_INCREMENT = 10;

  constructor(props: NotificationsProps) {
    super(props);
    this.state = {
      notifications: [],
      totalShown: 0
    }
  }

  componentDidMount() {
    this.getNotifications();
  }
  
  private getNotifications = () => {
    (async () => {
      try {
        const notificationsRO: NotificationsRO = await bent('json')(`${Utils.getAPIUrl()}/notifications`) as NotificationsRO;
        const totalShown = this.calcTotalShown(Notifications.SHOWN_INCREMENT, notificationsRO.notifications);
        this.setState({notifications: notificationsRO.notifications, totalShown});
      } catch (e) {
        console.log(e);
      }
    })();
  }

  private calcTotalShown(wantedTotal: number, notifications: INotification[]) {
    return wantedTotal > notifications.length ? notifications.length : wantedTotal;
  }

  private incrementTotalShown = () => {
    const totalShown = this.calcTotalShown(this.state.totalShown + Notifications.SHOWN_INCREMENT, this.state.notifications);
    this.setState({totalShown});
  }

  private onIncrementShownTrigger = (isVisible: boolean) => {
    if (isVisible) {
      this.incrementTotalShown();
    }
  }

  render(): React.ReactNode {

    const shownNotifications = this.state.notifications.slice(0, this.state.totalShown);
    return (
      <div className='notifications'>
        {
          shownNotifications.map((notification, index) => (
            <div key={index}>
              <Notification notification={notification} />
              {
                ( index >= shownNotifications.length - Notifications.SHOWN_INCREMENT ) ?
                <VisibilitySensor onChange={this.onIncrementShownTrigger}>
                  <span className='increment-shown-trigger'>&nbsp;</span>
                </VisibilitySensor>
                : null
              }
            </div>
          ))
        }
      </div>
    );
  }

}