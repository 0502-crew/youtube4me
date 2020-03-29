import './App.css';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { YTNotifications } from '@src/components/YTNotifications';

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <h1>Hello world!</h1>
        <YTNotifications />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));

/* Mark the App class as hot for hot reloading.
 * Anything loaded within App is also hot so this notation is only needed here unless there are multiple ReactDOM.render locations
 */
hot(App);