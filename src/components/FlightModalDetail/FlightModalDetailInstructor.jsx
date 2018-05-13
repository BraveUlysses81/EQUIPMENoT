import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../../components/UserPhoto'

class FlightModalDetailInstructor extends React.Component {
    constructor(props){
        super(props)
    }

    static propTypes = {
        flight: PropTypes.object.isRequired,

    };
    
    render(){
        return(
            <div id="flight-detail-modal-instructor">
                <div id="flight-detail-modal-instructor-container">
                    <span id="close-flight-instructor-text">INSTRUCTOR</span>

                    <br/>

                    <div id="flight-detail-modal-instructor-image-container">
                        <div id="flight-detail-modal-instructor-image-wrap">
                            <div id="customer-image" >
                                <UserPhoto picture_url={this.props.flight.instructor_picture} imageID="list-photo" thumbnailSize="user fa-2x"/>
                            </div>
                        </div>

                <div id="flight-modal-detail-instructor-list-name" className="pull-left">
                    {
                        this.props.flight.instructor_first + ' ' + this.props.flight.instructor_last
                    }
                </div>
                <br/>
                <div id="flight-modal-instructor-certs-top">
                    {this.props.flight.single_engine_instructor && `${this.props.flight.single_engine_instructor} `}
                    {this.props.flight.instrument_instructor && `${this.props.flight.instrument_instructor} `}
                    {this.props.flight.multi_engine_instructor && `${this.props.flight.multi_engine_instructor} `}
                    {this.props.flight.basic_ground_instructor && `${this.props.flight.basic_ground_instructor} `}
                </div>
                <br/>
                <div id="flight-modal-instructor-certs">
                    {this.props.flight.advanced_ground_instructor && `${this.props.flight.advanced_ground_instructor} `}
                    {this.props.flight.instrument_ground_instructor && `${this.props.flight.instrument_ground_instructor} `}
                    {this.props.flight.helicopter_instructor && `${this.props.flight.helicopter_instructor} `}
                    {this.props.flight.sport_pilot_instructor && `${this.props.flight.sport_pilot_instructor}`}
                </div>
                </div>
                </div>

                <br/>
                <br/>

            </div>
        )
    }
}

export default FlightModalDetailInstructor;