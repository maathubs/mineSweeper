import React from 'react';
const Button=(props)=> {
    return(
        <div>
            {/* <p className="welcome">Welcome {props.playerName} !!!</p> */}
            <button type={props.type} className={props.className} disabled={props.roll} onSubmit={props.onSubmit} onClick={props.onClick}>{props.value}</button>
        </div>
    )
}
export default Button