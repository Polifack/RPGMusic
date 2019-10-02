import React from 'react';
import {handleSongSelect} from './utils'
import SoundButton from './SoundButton'

const initialState = {
    buttons: [],
    buttonKey:0,
    buttonName: null
  }

class TabSFX extends React.Component{
    constructor(props) {
        super(props);
        this.state = initialState
        this.playerData = []
        this.buttonData = []
    }
}

export default TabSFX