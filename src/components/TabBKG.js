import React from 'react';
import Player from './Player'
import {handleOpenFile} from './utils'

const initialState = {
    players: [],
    playerKey: 0,
  }

class TabBKG extends React.Component{
    constructor(props) {
        super(props);
        this.state = initialState
        this.playerData = []
    }
}

export default TabBKG