import './Video.less';

import * as React from 'react';
import { IVideo } from '@src/models/api/IVideo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp, faTrashAlt, faBan, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import SwipeableViews from 'react-swipeable-views';
import { WatchedToast } from './WatchedToast';
import VisibilitySensor from 'react-visibility-sensor';

export interface VideoProps {
  video: IVideo;
  hasVisibilitySensor: boolean;
  incrementTotalShown: () => void;
}

export interface VideoState {
  expandedDescription: boolean;
  deleted: boolean;
  isSeen: boolean;
}

export class Video extends React.Component<VideoProps, VideoState> {

  constructor(props: VideoProps) {
    super(props);
    this.state = {
      expandedDescription: false,
      deleted: false,
      isSeen: false
    };
  }

  private expandDescription = (event: React.MouseEvent) => {
    this.setState((state) => ({expandedDescription: !state.expandedDescription}));
  }

  private deleteVideo = () => {
    new WatchedToast(this);
  }

  private onSeen = (isVisible: boolean): void => {
    if (isVisible) {
      this.setState({isSeen: true});
      this.props.incrementTotalShown();
    }
  }

  render(): React.ReactNode {
    const video = this.props.video;
    const descriptionLines = video.description.split('\n');
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const duration = video.duration ? [
      video.duration.hours,
      video.duration.minutes,
      video.duration.seconds].join(':') : null;
    if (this.state.deleted) {
      return null;
    } else {
      return (
        <SwipeableViews resistance index={1} className={`video-views ${this.state.deleted?'deleted':''}`}>
          <div className='video delete-view' onClick={this.deleteVideo}>
            <FontAwesomeIcon icon={faTrashAlt} className='delete-icon'/>
          </div>
          <div className='video-view'>
            <a href={videoUrl} className='thumbnail'>
              <img src={video.thumbnail} className='desktop'/>
              <img src={video.thumbnail} className='mobile'/>
              <span className='length'>{duration}</span>
            </a>
            <div className='video-details'>
              <div className='title'>
                <a href={videoUrl}>
                  {video.title}
                </a>
              </div>
              <div className='channel'>
                <a href={`https://www.youtube.com/channel/${video.channelID}`}>
                  {video.channelName}
                </a>
                <span className="date">{video.published.substring(0, video.published.indexOf('+')).replace('T',' ')}</span>
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
              <FontAwesomeIcon icon={faTrashAlt} onClick={this.deleteVideo}/>
            </div>
            {(!this.state.isSeen)
              ? <VisibilitySensor onChange={this.onSeen}>
                  <span className='increment-shown-trigger'>&nbsp;</span>
                </VisibilitySensor>
              : null
            }
          </div>
        </SwipeableViews>
      );
    }
  }
}