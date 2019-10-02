import React from 'react';
import PlayerList from './PlayerList'
import 'bootstrap';

export default class App extends React.Component {
  render() {
    return(
      <div className="bg">
        <PlayerList/>
      </div>
    );
  }
}
