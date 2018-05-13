import React from 'react'
import { render } from 'react-dom'
import FontAwesome from 'react-fontawesome'

// User Photo Component

const CloseFlightUserPhoto = (props) => {
    let button = null;
    if(props.picture_url){
        button = <div className="btn btn-inverse pull-left" id="user-image-thumbnail" disabled>
            <img src={props.picture_url} id={props.imageID} />
        </div>
    } else {
        button = <div className="btn btn-inverse pull-left" id="user-image-thumbnail" disabled >
            <FontAwesome id="close-flight-user-image-thumbnail" name={props.thumbnailSize}/>
            {/*<img id="default-user-image-thumbnail" src={ '/img/user.png' }/>*/}
        </div>
    }
    return(
        <div>
            {button}
        </div>
    )
};

export default CloseFlightUserPhoto