import { toast } from 'react-toastify';
import { Video } from './Video';
import * as bent from 'bent';
import { Utils } from '@src/utils/Utils';

export class WatchedToast {
  constructor(video: Video) {
    video.setState({deleted: true});
    
    const toastId = toast("Undo: " + video.props.video.title, {
      onClick: () => {
        video.setState({deleted: false});
        toast.dismiss(toastId);
      },
      onClose: () => {
        bent(`${Utils.getAPIUrl()}/wached/${video.props.video.id}`)('');
      },
      type: 'dark'
    });
  }
}