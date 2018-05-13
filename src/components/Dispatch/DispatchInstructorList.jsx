import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../../components/UserPhoto';
import ScrollArea from 'react-scrollbar';




class DispatchInstructorList extends React.Component {
    constructor() {
        super()
    }

    static propTypes = {
        dispatchInstructors: PropTypes.object.isRequired,
        selectDispatchInstructor: PropTypes.func.isRequired,
        selectedDispatchInstructor: PropTypes.object
    }

    renderDispatchInstructor = (key) => {

        const dispatchInstructor = this.props.dispatchInstructors[key]

        return(
            <div id="dispatch-instructor-list-container" key={key}>
            <div id="dispatch-instructor-list-key" >
                <div id="dispatch-instructor-list-item">

                    <button id={dispatchInstructor.buttonSelectedClass}
                            className="btn btn-default"
                            onClick={ () => {this.props.selectDispatchInstructor(dispatchInstructor)} }>

                        <div id="dispatch-instructor-list-image-wrap">
                            <div id="customer-image" >
                                <UserPhoto picture_url={dispatchInstructor.picture_url} imageID="list-photo" thumbnailSize="user fa-2x"/>
                            </div>
                        </div>

                        <div id="dispatch-instructor-list-name" className="pull-left">
                            {
                                dispatchInstructor.first_name + ' ' + dispatchInstructor.last_name
                            }
                        </div>
                        <br/>
                        <div id="dispatch-instructor-certs-top" className="pull-left">
                            {dispatchInstructor.single_engine_instructor && `${dispatchInstructor.single_engine_instructor} `}
                            {dispatchInstructor.instrument_instructor && `${dispatchInstructor.instrument_instructor} `}
                            {dispatchInstructor.multi_engine_instructor && `${dispatchInstructor.multi_engine_instructor} `}
                            {dispatchInstructor.basic_ground_instructor && `${dispatchInstructor.basic_ground_instructor} `}
                        </div>
                        <br/>
                        <div id="dispatch-instructor-certs" className="pull-left">
                            {dispatchInstructor.advanced_ground_instructor && `${dispatchInstructor.advanced_ground_instructor} `}
                            {dispatchInstructor.instrument_ground_instructor && `${dispatchInstructor.instrument_ground_instructor} `}
                            {dispatchInstructor.helicopter_instructor && `${dispatchInstructor.helicopter_instructor} `}
                            {dispatchInstructor.sport_pilot_instructor && `${dispatchInstructor.sport_pilot_instructor}`}
                        </div>
                    </button>
                </div>
            </div>
            </div>
        )
    };

    render() {
        return (
            <div id="dispatch-instructor-list">

                <div id="dispatch-instuctor-list-container" className="container">

                    {
                        Object.keys(this.props.dispatchInstructors).map(this.renderDispatchInstructor)
                    }

                </div>


            </div>
        )
    }
}

export default DispatchInstructorList;