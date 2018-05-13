import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../../components/UserPhoto'
import AircraftPhoto from '../../components/AircraftPhoto'



class AircraftList extends React.Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        aircrafts: PropTypes.object.isRequired,
        selectAircraft: PropTypes.func.isRequired
    };

    renderAircraft = (key) => {
        const aircraft = this.props.aircrafts[key];

        return(
            <div key={key}>
                <li id="customer-list-group" className="list-group-item">
                    <button id="customer-list-button" onClick={ () => this.props.selectAircraft(aircraft) } style={{ color: 'lightgray' }}>
                        <div id="aircraft-list-image-wrap">
                            <div id="customer-image" >
                                <UserPhoto picture_url={aircraft.picture_url} imageID="list-photo" thumbnailSize="user fa-2x"/>
                            </div>
                        </div>
                        <div id="aircraft-list-info">
                            <div id="aircraft-list-reg">
                                {
                                    aircraft.registration_nbr
                                }
                            </div>
                            <div id="aircraft-list-make">
                                {
                                    `${aircraft.make}` + ' ' + `${aircraft.model_id}`
                                }
                            </div>
                        </div>
                    </button>
                </li>
            </div>
        )
    };

    render () {
        return(
            <div id="customer-list" className="col-sm-3">
                <label id="customer-list-header">AIRCRAFT LIST</label>
                <ul className="list-group">
                    {
                        Object
                            .keys(this.props.aircrafts).map(this.renderAircraft)
                    }
                </ul>
            </div>
        )
    }
}

export default AircraftList;