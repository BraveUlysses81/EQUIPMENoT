import React from 'react'
import { render } from 'react-dom'
import FontAwesome from 'react-fontawesome'

// Aircraft Photo Component

const CloseFlightAircraftPhoto = (props) => {

    let button = null;

    if (props.picture_url == "no photo"){
        button = <div className="btn btn-inverse pull-left" id="aircraft-image" disabled>
            <FontAwesome id="close-flight-aircraft-image-thumbnail" name={props.thumbnailSize}/>
            {/*<img id="default-aircraft-image-thumbnail" src={ '/img/user.png' }/>*/}
        </div>
    } else if (props.picture_url) {
        button = <div className="btn btn-inverse pull-left" id="aircraft-image" disabled>
            <img src={props.picture_url} id={props.imageID}/>
        </div>

    } else {
        button = <div className="btn btn-inverse pull-left" id="aircraft-image" disabled>
            <FontAwesome id="close-flight-aircraft-image-thumbnail" name={props.thumbnailSize}/>
            {/*<img id="default-aircraft-image-thumbnail" src={ '/img/user.png' }/>*/}
        </div>
    }

    return(
        <div>
            {button}
        </div>
    )
};

export default CloseFlightAircraftPhoto