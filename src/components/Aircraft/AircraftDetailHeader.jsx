import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../../components/UserPhoto'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'



const AircraftDetailHeader =  (props) => {
    return (
        <div id="customer-detail-header">
            <div className="col-md-4">
                <div id="aircraft-detail-header-left">
                    <div id="close-flight-customer-header-image">
                        <UserPhoto
                            picture_url={props.selectedAircraft.picture_url}
                            imageID="close-modal-customer-image"
                            thumbnailSize="user fa-5x"/>
                    </div>
                </div>

                <h2 id="customer-detail-header-name">
                    {`${props.selectedAircraft.registration_nbr}`}
                </h2>
                <br/>

                <div id="customer-detail-header-date">
                    <span id="aircraft-detail-header-text">
                        Make:
                    </span>
                    <span id="aircraft-detail-header-info">
                    { `${props.selectedAircraft.make}` }
                    </span>
                </div>

                <div id="customer-detail-header-date">
                    <span id="aircraft-detail-header-text">
                        Model:
                    </span>
                    <span id="aircraft-detail-header-info">
                    { `${props.selectedAircraft.model_id}` }
                    </span>
                </div>

                <div id="customer-detail-header-date">
                    <span id="aircraft-detail-header-text">
                        Popular Name:
                    </span>
                    <span id="aircraft-detail-header-info">
                    { `${props.selectedAircraft.popular_name}` }
                    </span>
                </div>

                <div id="customer-detail-header-date">
                    <span id="aircraft-detail-header-text">
                        Year:
                    </span>
                    <span id="aircraft-detail-header-info">
                    { `${props.selectedAircraft.year}` }
                    </span>
                </div>

                <div id="customer-detail-header-date">
                    <span id="aircraft-detail-header-text">
                        Engine:
                    </span>
                    <span id="aircraft-detail-header-info">
                    { `${props.selectedAircraft.engine}` }
                    </span>
                </div>
                <div id="customer-detail-header-date">
                    <span id="aircraft-detail-header-text">
                        <Link to={{pathname: `/`, state: {modal: false}}} >Add/Update Aircraft image</Link>
                    </span>
                </div>
                <div id="aircraft-detail-header-dispatch-group">
                    <button id="pin-flight-btn" onClick={ () => props.editAircraftDetail() } type="button" className="btn btn-primary">
                        Edit Aircraft
                    </button>
                </div>
            </div>

            <div id="aircraft-detail-header-status-info">
                        <span id="current-aircraft-status">
                            Current Aircraft Status:
                        </span>
                        <br/>
                        <span id="current-aircraft-status-text">
                            { props.selectedAircraft.aircraft_status  === 'flight_line' ? `FLIGHT LINE` : `${props.selectedAircraft.aircraft_status}` }
                        </span>
            </div>

                {/*<div id="aircraft-detaill-header-aircraft_status">*/}
                    {/*<span id="aircraft-detail-header-text">*/}
                        {/*{*/}
                            {/*props.selectedAircraft.aircraft_status === 'flight_line' ?  `AirCraft Status: flight line`*/}
                            {/*: `AirCraft Status: ${props.selectedAircraft.aircraft_status}` }*/}
                    {/*</span>*/}
                {/*</div>*/}

            <br/>
            <hr id="customer-detail-header-hr" />
            <br/>
        </div>
    )
};

AircraftDetailHeader.propTypes = {
    editAircraftDetail: PropTypes.func.isRequired,
    selectedAircraft: PropTypes.object.isRequired
};

AircraftDetailHeader.defaultProps = {
    selectedAircraft: ""
};

export default AircraftDetailHeader;