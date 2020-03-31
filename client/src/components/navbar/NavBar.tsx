import './NavBar.css';
import * as React from 'react';

export class NavBar extends React.Component {
  render(): React.ReactNode {
    return (
      <div className='navbar'>
        <a href="javascript: void(0);">Notifications</a>
      </div>
    );
  }
}