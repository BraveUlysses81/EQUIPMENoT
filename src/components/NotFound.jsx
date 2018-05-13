import React from 'react';
import { render } from 'react-dom';


const NotFound = (props) => {
    return (
        <div id="not-Found">
            <h1>{`Sorry but "${props.location.pathname}" is not found on this Domain, please try another path.`}</h1>
            <h3><a href="http://localhost:8080/">EQUIP.ME.NoT HOME</a></h3>
        </div>
    )
}

export default NotFound;