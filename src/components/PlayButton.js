import React from 'react';

var initialState = {
    isSongLoaded: null,
    isNowPlaying: null,
    callback: null,
}

class PlayButton extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props);
        this.state = initialState

        this.state.isSongLoaded = this.props.isSongLoaded;
        this.state.isNowPlaying = this.props.isNowPlaying;
        this.state.callback = this.props.callback;
    }

    render(){
        return (
            <div>
                {(this.state.isSongLoaded())
                    ?(this.state.isNowPlaying())
                        ?<button onClick={this.state.callback()} className="iconButton"><i className="fa fa-stop fa-2x"/></button>
                        :<button onClick={this.state.callback()} className="iconButton"><i className="fa fa-play fa-2x"/></button>
                    :(this.state.isNowPlaying())
                        ?<button disabled onClick={this.state.callback()} className="iconButton"><i className="fa fa-stop fa-2x"/></button>
                        :<button disabled onClick={this.state.callback()} className="iconButton"><i className="fa fa-play fa-2x"/></button>
                }
            </div>
        )
    }
}

export default PlayButton