import React from 'react';
import Sound from 'react-sound';
import { getSongData} from './utils'

var style = {
    background: '#c4c4c4',
    maxWidth: '25%',
    overflow:'hidden', 
    whiteSpace:'nowrap',
    textOverflow: 'ellipsis',
    color: 'white',
  };

var closeButton = {
  verticalAlign: 'top',
  backgroundColor: 'black',
  border: 'none',
  color: 'white',
  textAlign: 'center',
  fontSize: '15px',
  borderRadius: '100%',
  margin: '-1% -5%'
}

const initialState = {
  playStatus: Sound.status.STOPPED,
  hovered: false
}

class SoundButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = initialState

        //Inicializamos las propiedades basicas del objeto
        this.song = null
        this.name = null
        this.tid = null
        this.songData = null

        //Asignamos las propiedades (si existen)
        this.song = this.props.song
        this.name = this.props.name
        this.tid = this.props.tid
        
        this.props.callback(this.tid, {song: this.song, name: this.name})
        this.deleteCallback = this.props.deleteCallback
        this.loadCurrentSong()
      } 
    

    loadCurrentSong(){
        if (this.song!==undefined && this.songData == null) {
          getSongData(this.song).then((result)=>this.songData=result)
        }
    }

    onButtonClicked(){
      console.log("click")
      console.log(this.state)
        if (this.state.playStatus === Sound.status.STOPPED) this.setState({playStatus:Sound.status.PLAYING})
    }

    onHover() {
      console.log("enter")
      this.setState({hovered:true})
    }
  
    onExit() {
      console.log("leave")
      this.setState({hovered:false})
    }
    
    render() {
        return (
            <div className="container"  
            onMouseEnter={()=>this.onHover()}
            onMouseLeave={()=>this.onExit()}>
            <button className="btn btn-secondary" style={style} 
            onClick={()=>this.onButtonClicked()}>
                {this.songData!=null && (
                  <Sound
                    url={this.songData}
                    playStatus={this.state.playStatus}
                  />
                  )}
                    {this.name}
            </button>
            {(this.state.hovered) && (
              <button style={closeButton} onClick={()=>this.deleteCallback(this.tid)}>
                <i class="fas fa-times"></i>
              </button>
            )}
            </div>
        )

    }

}

export default SoundButton