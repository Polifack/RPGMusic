import React from 'react';
import Player from './Player'
import {handleSceneSave, handleSceneOpen, handleSongSelect, handleFileOpen} from './utils'
import SoundButton from './SoundButton'

var headStyle = {
    color: 'white',
    fontSize: '30px',
    marginLeft:'25px'
}

const initialState = {
    players: [],
    buttons: [],
    playerKey: 0,
    buttonKey:0,
    buttonName: null
  }

class PlayerList extends React.Component{
    constructor(props) {
        super(props);
        this.state = initialState
        this.playerData = []
        this.buttonData = []
    }

    playerCallback(tid, data){
        //Data = {songs:songs, name:name}
        this.playerData[tid] = data
    }

    playerDelete(tid){
        var Players = this.state.players
        var newPlayers = []
        Players.forEach((player)=>{if (player.tid!==tid) newPlayers.push(player)})
        console.log(tid)
        console.log(Players)
        console.log(newPlayers)
        this.setState({players:newPlayers})
    }

    async handleAddPlayer(isNew){
        var Player = {}
        if (isNew)Player = {tid: this.state.playerKey, name: "", songs: []}
        else{
            var data = await handleFileOpen()
            if (data !== undefined){
                var Player = {tid: this.state.playerKey, songs:data.songs, name:data.name}
            }
        }
        var newPlayers = [...this.state.players, Player]
        var newKey = this.state.playerKey + 1
        this.setState({players: newPlayers, playerKey: newKey})
    }

    renderPlayers(){
        return this.state.players.map((player)=>{
            console.log(player)
            return(<Player
                key = {player.tid}
                tid = {player.tid}
                name = {player.name}
                songs = {player.songs}
                callback={(tid, data)=>this.playerCallback(tid, data)}
                deleteCallback={(tid)=>this.playerDelete(tid)}/>
                )
        })
    }

    createButton(button){
        var name = "button"
        var songs = null
        var newTid = this.state.key

        return <SoundButton 
        tid={newTid} 
        name={name} 
        songs={songs} 
        callback={(tid, data)=>this.buttonCallback(tid, data)}
        deleteCallback={(tid)=>this.buttonDelete(tid)}
        />
    }

    buttonCallback(tid, data){
        this.buttonData[tid] = data
    }

    buttonDelete(tid){
        var Buttons = this.state.buttons
        var newButtons = []
        Buttons.forEach((button)=>{if (button.tid!==tid) newButtons.push(button)})
        console.log(tid)
        console.log(Buttons)
        console.log(newButtons)
        this.setState({buttons:newButtons})
    }

    async handleAddButton(){
        var song = await handleSongSelect()
        if (song!==undefined && song!==null){
            var Button = {tid: this.state.buttonKey, name: this.state.buttonName, song: song}
            var newButton = [...this.state.buttons, Button]
            var newKey = this.state.buttonKey + 1
            this.setState({buttons: newButton, buttonKey: newKey, buttonName: ""})
        }
    }

    renderButtons(){
        return this.state.buttons.map((button)=>{
            return(<SoundButton
                key={button.tid}
                tid={button.tid}
                name={button.name}
                song={button.song}
                callback={(tid, data)=>this.buttonCallback(tid, data)}
                deleteCallback={(tid)=>this.buttonDelete(tid)}
                />
                
            )
        })
    }

    handleNameChange(e){
        this.setState({buttonName: e.target.value})
      }


    async saveSceneToFile(){
        await handleSceneSave({players: this.playerData, buttons: this.buttonData})
    }

    async loadSceneFromFile(){
        var sceneData = await handleSceneOpen();
        if (sceneData !== undefined){
            this.playerData  = sceneData.players
            this.buttonData = sceneData.buttons
            this.createSceneFromSceneData()
        }
    }

    createSceneFromSceneData(){
        this.setState(initialState)
        var tempPlayers = []
        var tempButtons = []
        var tempPlayerKey = this.state.playerKey
        var tempButtonKey = this.state.buttonKey
        this.playerData.forEach( (track) => {
            var Player = {tid:tempPlayerKey, name: track.name, songs:track.songs}
            tempPlayers.push(Player)
            tempPlayerKey++
        })
        this.buttonData.forEach( (button)=>{
            var Button = {tid: tempButtonKey, name:button.name, song: button.song}
            tempButtons.push(Button)
            tempButtonKey++
        })
        this.setState({players: tempPlayers, buttons: tempButtons, playerKey: tempPlayerKey, buttonKey: tempButtonKey})
    }



    render() {
        return (
            <div>
                <div className="row">
                    
                    <div className="col-md-auto">
                        <h className="tabHeader">RPG PLAYER</h>
                    </div>

                    <div className="col-md-auto btn-group text-center float-right">
                        <button class="iconButton" onClick={e =>this.saveSceneToFile()}> 
                            <i className="fas fa-save fa-2x"/> 
                        </button>
                        <button class="iconButton" onClick={e => this.loadSceneFromFile()}>  
                            <i class="fa fa-folder-open fa-2x"/> 
                        </button>
                    </div>

                </div>


                <div class="container mainContainer">
                <div class="row border">
                    <div className="col-md-8 border musicTab">
                        <div className="row">
                            <div className="col-md-auto align-middle">
                                <h className="tabHeader">BACKGROUND</h>
                            </div>
                            <div className="col-md-auto btn-group text-center">
                                <button class="iconButton" onClick={e => this.handleAddPlayer(true)}> 
                                    <i class="fa fa-plus-square fa-2x"/> 
                                </button>
                                <button class="iconButton" onClick={e => this.handleAddPlayer(false)}> 
                                    <i class="fa fa-folder-open fa-2x"/> 
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            {this.renderPlayers()}
                        </div>
                        
                    </div>


                    <div className="col-md-4 border sfxTab">
                        <div className="row">
                            <div className="col-md-auto">
                                <h className="tabHeader">SFX</h>
                            </div>
                            <div className="col-md-auto btn-group">
                                <input
                                    value = {this.state.buttonName}
                                    placeholder={"Input a name"} 
                                    className="input" 
                                    onChange = {e=>this.handleNameChange(e)}/>
                                {
                                (this.state.buttonName!==undefined && this.state.buttonName!=="" && this.state.buttonName!==null)?
                                <button 
                                    type="button"  
                                    class="iconButton" 
                                    onClick={e => this.handleAddButton()}> 
                                    <i class="fa fa-plus-square fa-2x"></i>  
                                </button>
                                :
                                <button 
                                    type="button" 
                                    disabled 
                                    class="iconButton" 
                                    onClick={e => this.handleAddButton()}> 
                                    <i class="fa fa-plus-square fa-2x"></i>  
                                </button>
                                }
                            </div>
                        </div>
                        <div className="row">
                            {this.renderButtons()}
                        </div>
                    </div>
                </div>
                </div>


            </div>
        )
    }
}

export default PlayerList
