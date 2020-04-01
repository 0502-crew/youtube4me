import './Notification.css';

import * as React from 'react';
import { INotification } from '@src/models/api/INotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';

export interface NotificationProps {
  notification: INotification;
}

export interface NotificationState {
  expandedDescription: boolean;
}

export class Notification extends React.Component<NotificationProps, NotificationState> {

  constructor(props: NotificationProps) {
    super(props);
    this.state = {
      expandedDescription: false
    };
  }

  private expandDescription = (event: React.MouseEvent) => {
    this.setState((state) => ({expandedDescription: !state.expandedDescription}));
  }
  render(): React.ReactNode {
    const notification = this.props.notification;
    const descriptionLines = notification.videoDetails.description.split('\n');
    return (
      <div className='notification'>
        <a href={`https://www.youtube.com/watch?v=${notification.videoDetails.id}`} target="_blank">
          <img src={notification.videoDetails.thumbnails.medium.url} className='thumbnail desktop' style={{'height': notification.videoDetails.thumbnails.medium.height}} />
          <img src={notification.videoDetails.thumbnails.default.url} className='thumbnail mobile' style={{'height': notification.videoDetails.thumbnails.default.height}} />
        </a>
        <div className='video-details'>
          <a href={`https://www.youtube.com/watch?v=${notification.videoDetails.id}`} target="_blank">
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
                    : undefined
                  }
                  <div className={(index < 2) ? (index == 1 && line.length == 0) ? 'overflow' : 'preview' : 'overflow'}>{line}&nbsp;</div>
                  {
                    (descriptionLines.length > 3 && index == descriptionLines.length - 1 && this.state.expandedDescription)
                    ? <div className='expand' onClick={this.expandDescription}><FontAwesomeIcon icon={faChevronCircleUp} /> Show less</div>
                    : undefined
                  }
                </div>
              })
            }
          </div>
        </div>
      </div>
    );
  }
}