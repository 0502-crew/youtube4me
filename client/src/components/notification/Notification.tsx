import './Notification.css';

import * as React from 'react';
import { INotification } from '@src/models/api/INotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp, faTrashAlt, faBan, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import SwipeableViews from 'react-swipeable-views';
import * as bent from 'bent';
import { Utils } from '@src/utils/Utils';

export interface NotificationProps {
  notification: INotification;
}

export interface NotificationState {
  expandedDescription: boolean;
  deleted: boolean;
}

export class Notification extends React.Component<NotificationProps, NotificationState> {

  constructor(props: NotificationProps) {
    super(props);
    this.state = {
      expandedDescription: false,
      deleted: false
    };
  }

  private expandDescription = (event: React.MouseEvent) => {
    this.setState((state) => ({expandedDescription: !state.expandedDescription}));
  }

  private deleteNotification = () => {
    bent(`${Utils.getAPIUrl()}/deleteNotification/${this.props.notification.messageId}`)('');
    this.setState({deleted: true});
  }

  render(): React.ReactNode {
    const notification = this.props.notification;
    const descriptionLines = notification.videoDetails.description.split('\n');
    const videoUrl = `https://www.youtube.com/watch?v=${notification.videoDetails.id}`;
    const duration = [
      notification.videoDetails.duration.hours,
      notification.videoDetails.duration.minutes,
      notification.videoDetails.duration.seconds].join(':');
    if (this.state.deleted) {
      return null;
    } else {
      return (
        <SwipeableViews resistance index={1} className={`notification-views ${this.state.deleted?'deleted':''}`}>
          <div className='notification delete-view' onClick={this.deleteNotification}>
            <FontAwesomeIcon icon={faTrashAlt} className='delete-icon'/>
          </div>
          <div className='notification-view'>
            <a href={videoUrl} className='thumbnail'>
              <img src={notification.videoDetails.thumbnails.medium.url} className='desktop'/>
              <img src={notification.videoDetails.thumbnails.medium.url} className='mobile'/>
              <span className='length'>{duration}</span>
            </a>
            <div className='video-details'>
                <div className='title'>
                  <a href={videoUrl}>
                    {notification.videoDetails.title}
                  </a>
              </div>
              <div className='channel'>
                <a href={`https://www.youtube.com/channel/${notification.videoDetails.channelId}`}>
                  {notification.videoDetails.channelTitle}
                </a>
                <span className="date">{notification.videoDetails.publishedAt.replace('T',' ').replace('.000Z','')}</span>
              </div>
              <div className={`description ${(this.state.expandedDescription)? 'expanded' : ''}`}>
                {
                  descriptionLines.map((line, index) => {
                    return <div key={index}>
                      {
                        (index === 2 && descriptionLines.length > 3 && !this.state.expandedDescription)
                        ? <div className='expand' onClick={this.expandDescription}><FontAwesomeIcon icon={faChevronCircleDown} /> Show more</div>
                        : null
                      }
                      <div className={(index < 2) ? (index == 1 && line.length == 0) ? 'overflow' : 'preview' : 'overflow'}>{line}&nbsp;</div>
                      {
                        (descriptionLines.length > 3 && index == descriptionLines.length - 1 && this.state.expandedDescription)
                        ? <div className='expand' onClick={this.expandDescription}><FontAwesomeIcon icon={faChevronCircleUp} /> Show less</div>
                        : null
                      }
                    </div>
                  })
                }
              </div>
            </div>
            <div className='delete-icon'>
              <FontAwesomeIcon icon={faTrashAlt} onClick={this.deleteNotification}/>
            </div>
          </div>
          <div className='more-view'>
            <div>Channel</div>
            <div>Related</div>
          </div>
        </SwipeableViews>
      );
    }
  }
}