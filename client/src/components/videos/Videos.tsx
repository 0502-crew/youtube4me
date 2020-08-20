import './Videos.css';

import * as React from 'react';
import * as bent from 'bent';
import { IVideo } from '@src/models/api/IVideo';
import { VideosRO } from '@src/models/api/VideosRO';
import { Video } from '../video/Video';
import VisibilitySensor from 'react-visibility-sensor';
import { Utils } from '@src/utils/Utils';


interface VideosState {
  videos: IVideo[]
  totalShown: number;
}
interface VideosProps {
  
}

export class Videos extends React.Component<VideosProps, VideosState> {
  private static readonly SHOWN_INCREMENT = 10;

  constructor(props: VideosProps) {
    super(props);
    this.state = {
      videos: [],
      totalShown: 0
    }
  }

  componentDidMount() {
    this.getVideos();
  }
  
  private getVideos = () => {
    (async () => {
      try {
        const videosRO: VideosRO = await bent('json')(`${Utils.getAPIUrl()}/videos`) as VideosRO;
        const totalShown = this.calcTotalShown(Videos.SHOWN_INCREMENT, videosRO.videos);
        this.setState({videos: videosRO.videos, totalShown});
      } catch (e) {
        console.log(e);
      }
    })();
  }

  private calcTotalShown(wantedTotal: number, videos: IVideo[]) {
    return wantedTotal > videos.length ? videos.length : wantedTotal;
  }

  private incrementTotalShown = () => {
    const totalShown = this.calcTotalShown(this.state.totalShown + Videos.SHOWN_INCREMENT, this.state.videos);
    this.setState({totalShown});
  }

  private onIncrementShownTrigger = (isVisible: boolean) => {
    if (isVisible) {
      this.incrementTotalShown();
    }
  }

  render(): React.ReactNode {

    const shownVideos = this.state.videos.slice(0, this.state.totalShown);
    return (
      <div className='videos'>
        {
          shownVideos.map((video, index) => (
            <div key={index}>
              <Video video={video} />
              {
                ( index >= shownVideos.length - Videos.SHOWN_INCREMENT ) ?
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