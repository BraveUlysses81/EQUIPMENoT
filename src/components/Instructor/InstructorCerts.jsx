import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'
import FontAwesome from 'react-fontawesome'


class InstructorCerts extends React.Component {
    // set initial state
    state = {
        fircDays: "",
        FircFontColor: ""
    };

    constructor(props) {
        super(props)
    }

    static propTypes = {
        instructorDocuments: PropTypes.object.isRequired
    };

    // componentWillReceiveProps (nextProps) {
    //     if (this.props.instructorDocuments != nextProps.instructorDocuments) {
    //         const instructorDocuments = nextProps.instructorDocuments;
    //         this.setState({instructorDocuments: instructorDocuments})
    //     }
    // }

    calcFircDate = () => {
        let FircFontColor = '#000000';
        let currentDate = new Date();
        let fircExpireDate = new Date(this.props.instructorDocuments.firc); //convert currency end date to date
        fircExpireDate = fircExpireDate.setFullYear(fircExpireDate.getFullYear() + 2); // add 2 years to the flight review date
        let fircDays = Math.round((fircExpireDate - currentDate) / (1000 * 60 * 60 * 24));
        if(fircDays < 0) {
            fircDays = 0;
            FircFontColor = '#ff0000'
        }
        fircDays = fircDays > 0 ? fircDays : 0;
        this.setState({ fircDays, FircFontColor })
    };

    componentDidMount() {
        this.calcFircDate()
    }

    render () {
        return (
            <div>
                <div className="row" id="pilot-documents">
                    <FontAwesome name="plane" id="plane-tiny"/>
                    <span className="col-sm-3" id="pilot-certificate-number">
                        {this.props.instructorDocuments.faa_instructor_certificate_number}
                    </span>
                    <div className="col-sm-4" id="pilot-certificate-text">
                        {`FLIGHT INSTRUCTOR`}
                    </div>
                    <div className="col-sm-4">

                        {this.props.instructorDocuments.single_engine_instructor && `${this.props.instructorDocuments.single_engine_instructor}, `}
                        {this.props.instructorDocuments.instrument_instructor && `${this.props.instructorDocuments.instrument_instructor}, `}
                        {this.props.instructorDocuments.multi_engine_instructor && `${this.props.instructorDocuments.multi_engine_instructor}, `}
                        {this.props.instructorDocuments.basic_ground_instructor && `${this.props.instructorDocuments.basic_ground_instructor}, `}
                        {this.props.instructorDocuments.advanced_ground_instructor && `${this.props.instructorDocuments.advanced_ground_instructor}, `}
                        {this.props.instructorDocuments.instrument_ground_instructor && `${this.props.instructorDocuments.instrument_ground_instructor}, `}
                        {this.props.instructorDocuments.helicopter_instructor && `${this.props.instructorDocuments.helicopter_instructor}, `}
                        {this.props.instructorDocuments.sport_pilot_instructor && `${this.props.instructorDocuments.sport_pilot_instructor}`}

                    </div>
                </div>

                <div className="row" style={{color: this.state.FircFontColor}}>
                    <div className="col-sm-3" id="flightReview" >
                        {`${this.state.fircDays} days`}
                    </div>
                    <div className="col-sm-4">
                        {`FIRC`}
                    </div>
                    <div className="col-sm-4" >
                        {
                            this.props.instructorDocuments.firc &&
                            `${dateFormat(this.props.instructorDocuments.firc, "longDate")}`}
                    </div>
                </div>

            </div>
        )
    }
}

export default InstructorCerts;