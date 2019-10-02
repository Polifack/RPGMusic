import React from 'react';


//condition -> () => bool -> indica cuando el boton cambia de modo
//callback -> () => f() -> funcion que ejecuta el boton en el modo 
//content -> jsx element -> contenido que tendrá el botón
//style -> string -> className que tendrá el estilo del botón

var initialState = {
    condition: null,
    callback: null,
    content: null,
    styles: null
}

class SaveButton extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props);
        this.state = initialState

        this.state.condition = this.props.condition;
        this.state.callback = this.props.callback;
        this.state.content = this.props.content;
        this.state.styles = this.props.styles;
    }

    render(){
        return (
            <div>
                {(this.state.condition())
                    ?<button type="button" onClick={this.state.callback()} className={this.state.styles} >{this.state.content}</button>
                    :<button type="button" disabled onClick={this.state.callback()} className={this.state.styles} >{this.state.content}</button>
                }
            </div>
        )
    }
}





export default SaveButton