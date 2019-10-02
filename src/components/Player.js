import React from 'react';
import Sound from 'react-sound';
import SaveButton from './SaveButton'
import PlayButton from './PlayButton'
import {handleFileSelect, handleFileSave, getSongData, handleFileOpen} from './utils'

const initialState = {
  volume : 100,
  name : "",
  songs : [],
  position: 0,
  progress: 0,
  currentSong : null,
  repeat: false,
  shuffle: false,
  status: Sound.status.STOPPED
}


var divStyle = {
  margin: '1%',
  background: '#c4c4c4',
  color: 'black',
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all', // 'ms' is the only lowercase vendor prefix
};

var lblStyle={
  maxWidth: '60%',
  overflow:'hidden', 
  whiteSpace:'nowrap',
  textOverflow: 'ellipsis'
}

class Player extends React.Component {
  constructor(props) {
    super(props);
    //Inicializamos el estado del objeto
    this.state = initialState

    //Inicializamos las propiedades basicas del objeto
    this.songs = []
    this.tid = ""

    //Asignamos las propiedades (si existen)
    this.songs = this.props.songs
    this.state.name = this.props.name
    this.tid = this.props.tid

    //Asignamos el callback
    this.giveInfoToParent = this.props.callback
    this.deleteCallback = this.props.deleteCallback

    this.loadCurrentSong()

  }


  handleShuffleButton(event){
    if (this.state.shuffle) this.setState({shuffle: false})
    else this.setState({shuffle: true})
  }

  handleRepeatButton(event){
    if (this.state.repeat) this.setState({repeat: false})
    else this.setState({repeat: true})
  }

  handleVolumeChange(event){
    event.preventDefault();
    this.setState({volume: event.target.value})
  }

  async handleSelectFile(){
    var data = await handleFileSelect()
    if (data !== undefined){
      this.songs = data
      this.loadCurrentSong()
    }
    this.giveInfoToParent(this.tid, {songs:this.songs, name:this.state.name})
  }

  async handleOpenFile(){
    var data = await handleFileOpen()
    if (data !== undefined){
      console.log(data)
      this.songs = data.songs
      this.state.name = data.name
      this.loadCurrentSong()
    }
    this.giveInfoToParent(this.tid, {songs:this.songs, name:this.state.name})
  }



  getNextSong(){
    var nextSong = (
      (this.state.shuffle)? 
      Math.floor(Math.random() * Math.floor(this.songs.length)) : 
      (((this.songs.length-1)<this.state.position)? 
        this.state.position+1 : 
        this.state.position))
    
    nextSong = (this.state.repeat? this.state.position : nextSong)
    console.log(nextSong)
    this.setState({position: nextSong})
    this.loadCurrentSong()
  }

  loadCurrentSong(){
    if (this.songs!==undefined && this.songs.length>0) {
      getSongData(this.songs[this.state.position]).then((result)=>this.setState({currentSong:result}))
    }
  }

  isNameLoaded = () => (this.state.name!==null && this.state.name!=="")
  isSongLoaded = () => (this.songs!==undefined && this.songs.length>0)
  isPlayerLoaded = () => this.isNameLoaded()&&this.isSongLoaded()
  isNowPlaying = () => (this.state.status === Sound.status.PLAYING)
  handleSaveFile = async() => await handleFileSave({name: this.state.name, songs: this.songs})
  handlePlayButton = () => this.setState({status: (this.isNowPlaying())?Sound.status.STOPPED:Sound.status.PLAYING})
  
    
  render() {
    return (
    <div className="container mb-md-1 pd-md-2 pt-md-2 pb-md-2" style={divStyle}>
      <div className="row">
        <div className="col-md-3 border-right align-items-center" id="playerNameColumn">
          <input
            placeholder="Input a name"
            defaultValue={this.state.name}
            onChange = {(e)=>this.setState({name:e.target.value})}
            className="input align-items-center"
            />
        </div>

        <div className="col-md-9" id="nowPlayingColumn">
          <div className="row-md-1" id="nowPlayingAndButtonsRow">
            <label className="ml-2" id="playerCurrentSong" style={lblStyle}> 
              {
                (this.isSongLoaded())
                ?this.songs[this.state.position].title 
                :"Select a song"
              } 
            </label>
            <div className="btn-group float-right align-items-center" id="playerOperationButtons">
              <button onClick={e => this.handleSelectFile()} className="iconButton">
                <i className="fa fa-music fa-lg"/>
              </button>
              <SaveButton 
                condition={this.isPlayerLoaded}
                callback={()=>this.handleSaveFile}
                content={<i className="fas fa-save fa-lg"/>}
                styles={"iconButton"}
              />
              <button onClick={e => this.handleOpenFile()} className="iconButton">
                <i className="fa fa-folder-open fa-lg"/>
              </button>
              <button onClick={()=>this.deleteCallback(this.tid)} className="iconButton">
              <i class="fas fa-times fa-lg"></i>
              </button>
            </div>

          </div>

          <div className="row-md-7" id="progressBarRow">

            <div className="container">
              <div className="row align-items-center">
                <div className="col-sm-2">
                  <PlayButton isSongLoaded={this.isSongLoaded} isNowPlaying={this.isNowPlaying} callback={()=>this.handlePlayButton}/>
                </div>

                <div className="col-sm-10">
                  {this.state.currentSong!=null && (
                    <Sound url={this.state.currentSong} playStatus={this.state.status} volume={this.state.volume}
                      onPlaying={({position, duration})=> this.setState({progress: (position/duration)*100})}
                      onStop={() => this.setState({progress: 0})} onFinishedPlaying={() => this.getNextSong()}/>
                  )}

                  <div className = "row progress">
                    <div className="progress-bar"
                      Style={("width :"+this.state.progress+"%")}
                      aria-valuenow={this.state.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"/>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="row-md-4">
            <div className="btn-group align-items-center ml-3">
              <i className="iconButton fa fa-volume-up"/>
              <input 
                type="range"
                className="input-range"
                defaultValue={this.state.volume}
                min="0"
                max="100"
                step="1"
                onInput={(e)=>this.handleVolumeChange(e)}/>
              <button onClick={e => this.handleShuffleButton(e)} className="iconButton">
                {(this.state.shuffle)?<i className="fa fa-random iconEnabled"/>:<i className="fas fa-random"/>}
              </button>
              <button onClick={e => this.handleRepeatButton(e)} className="iconButton">
                {(this.state.repeat)?<i className="fa fa-redo iconEnabled"/>:<i className="fas fa-redo"/>}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
    );
  }
}

export default Player
