import React from 'react';
const Textbox=(props)=>{
    return(    
        <input type={props.type} onBlur={props.onBlur} onKeyUp={props.onkeyup}onKeyPress={props.onKeyPress}  className={props.className} placeholder={props.placeholder}/>
    )
}
export default Textbox