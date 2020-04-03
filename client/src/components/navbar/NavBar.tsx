import './NavBar.css';
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

export class NavBar extends React.Component {
  render(): React.ReactNode {
    return (
      <div className='navbar'>
        <a href="#">Notifications</a>
        <span className="fill"></span>
        <span className="refresh" onClick={() => document.location.reload()}><FontAwesomeIcon icon={faSyncAlt} /></span>
      </div>
    );
  }
}