import './Notification.css';

import * as React from 'react';
import { INotification } from '@src/models/api/INotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp, faTrashAlt, faBan, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import SwipeableViews from 'react-swipeable-views';

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
    this.setState({deleted: true});
  }

  render(): React.ReactNode {
    const notification = this.props.notification;
    const descriptionLines = notification.videoDetails.description.split('\n');
    const videoUrl = `https://www.youtube.com/watch?v=${notification.videoDetails.id}`;
    if (this.state.deleted) {
      return null;
    } else {
      return (
        <SwipeableViews resistance index={1} className={`notification-views ${this.state.deleted?'deleted':''}`}>
          <div className='notification delete-view' onClick={this.deleteNotification}>
            <FontAwesomeIcon icon={faTrashAlt} className='delete-icon'/>
          </div>
          <div className='notification-view'>
            <a href={videoUrl} target="_blank">
              <img src={notification.videoDetails.thumbnails.medium.url} className='thumbnail desktop'/>
              <img src={notification.videoDetails.thumbnails.medium.url} className='thumbnail mobile'/>
            </a>
            <div className='video-details'>
              <a href={videoUrl} target="_blank">
                <div className='title'>
                  {notification.videoDetails.title}
                </div>
              </a>
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
            <div className='delete-icon' onClick={this.deleteNotification}>
              <FontAwesomeIcon icon={faTrashAlt}/>
            </div>
          </div>
        </SwipeableViews>
      );
    }
  }
}