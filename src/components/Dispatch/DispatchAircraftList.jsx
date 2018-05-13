import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types'
import AircraftPhoto from '../AircraftPhoto';
import ScrollArea from 'react-scrollbar';

class DispatchAircraftList extends React.Component {
    state = {

    };

    constructor(props) {
        super(props)
    }

    static propTypes = {
        dispatchAircrafts: PropTypes.object.isRequired,
        selectDispatchAircraft: PropTypes.func.isRequired,
        selectedDispatchAircraft: PropTypes.object
    };

    renderDispatchAircraft = (key) => {

        const dispatchAircraft = this.props.dispatchAircrafts[key];

        return(
            <div key={key}>
                <div id="dispatch-aircraft-list-key" >
                <div id="dispatch-aircraft-list-item">

                    <button id={dispatchAircraft.buttonSelectedClass}
                            onClick={ () => {this.props.selectDispatchAircraft(dispatchAircraft)} }
                            className="btn btn-default">

                        <figure id="aircraft-list-figure">
                        <img className="dispatch-aircraft-thumbs" src={dispatchAircraft.picture_url}/>
                        <figcaption id="registration-number-caption">{dispatchAircraft.registration_nbr}</figcaption>
                        </figure>
                    </button>
                </div>
                </div>
            </div>
        )
    };

    render() {
        return (
            <div id="dispatch-aircraft-list">
                <div id="dispatch-aircraft-list-container" className="">
                    {
                        Object.keys(this.props.dispatchAircrafts).map(this.renderDispatchAircraft)
                    }
                </div>
            </div>

        )
    }


}

export default DispatchAircraftList;