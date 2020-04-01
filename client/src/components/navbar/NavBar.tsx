import './NavBar.css';
import * as React from 'react';

export class NavBar extends React.Component {
  render(): React.ReactNode {
    return (
      <div className='navbar'>
        <a href="#">Notifications</a>
      </div>
    );
  }
}