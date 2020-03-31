import './App.css';
import './reset.css';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Notifications } from '@src/components/notifications/Notifications';
import { NavBar } from './components/navbar/NavBar';

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <div className='App'>
        <NavBar />
        <main>
          <Notifications />
        </main>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));

/* Mark the App class as hot for hot reloading.
 * Anything loaded within App is also hot so this notation is only needed here unless there are multiple ReactDOM.render locations
 */
hot(App);