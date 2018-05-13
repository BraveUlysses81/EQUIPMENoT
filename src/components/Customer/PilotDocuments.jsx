import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'


// Individual Customer Component

class PilotDocuments extends React.Component {
    // set initial state
    state = {
        flightReviewDays: "",
        medicalClass: "",
        medicalDaysRemaining: "",
        flightReviewFontColor: "",
        medicalClassFontColor: "#000000"
    };

    constructor() {
        super()
    }

    static propTypes = {
        pilotDocuments: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.calcFlightReviewDate();
        this.calcMedicalClass()
    }

    calcFlightReviewDate = () => {
        let flightReviewFontColor = '#000000';
        let currentDate = new Date();
        let reviewExpireDate = new Date(this.props.pilotDocuments.flight_review_date); //convert currency end date to date
        reviewExpireDate = reviewExpireDate.setFullYear(reviewExpireDate.getFullYear() + 2); // add 2 years to the flight review date
        let flightReviewDays = Math.round((reviewExpireDate - currentDate) / (1000 * 60 * 60 * 24));
        if(flightReviewDays < 0) {
            flightReviewDays = 0;
            flightReviewFontColor = '#ff0000'
        }
        flightReviewDays = flightReviewDays > 0 ? flightReviewDays : 0;
        this.setState({ flightReviewDays, flightReviewFontColor })
    };

    calcMedicalClass = () => {
        let currentDateDays = (Math.round(new Date())) / (1000 * 60 * 60 * 24);
        let medicalDateDays =  (Math.round(new Date(this.props.pilotDocuments.medical_date))) / (1000 * 60 * 60 * 24);
        let classOneIsExpired = (currentDateDays - medicalDateDays) > 181; // class one expires 180 days
        let classTwoIsExpired = (currentDateDays - medicalDateDays) > 366; // class two expires 365 days
        let classThreeIsExpired = (currentDateDays - medicalDateDays) > 731; // class three expires 730 days

        if(this.props.pilotDocuments.medical_class == 'one') {
            if(!classOneIsExpired ){
                let medicalDaysRemaining = Math.round((medicalDateDays + 180) - currentDateDays)
                this.setState({ medicalClass: 1, medicalDaysRemaining: medicalDaysRemaining })
            } else if(!classTwoIsExpired) {
                let medicalDaysRemaining = Math.round((medicalDateDays + 365) - currentDateDays)
                this.setState({medicalClass: 2, medicalDaysRemaining: medicalDaysRemaining})
            } else if(!classThreeIsExpired) {
                let medicalDaysRemaining = Math.round((medicalDateDays + 730) - currentDateDays)
                this.setState({medicalClass: 3, medicalDaysRemaining: medicalDaysRemaining})
            } else {
                this.setState({medicalClass: 3, medicalDaysRemaining: 0, medicalClassFontColor: '#ff0000'})
            }
        } else if(this.props.pilotDocuments.medical_class == 'two') {
            if(!classTwoIsExpired) {
                let medicalDaysRemaining = Math.round((medicalDateDays + 365) - currentDateDays)
                this.setState({medicalClass: 2, medicalDaysRemaining: medicalDaysRemaining})
            } else if(!classThreeIsExpired) {
                let medicalDaysRemaining = Math.round((medicalDateDays + 730) - currentDateDays)
                this.setState({medicalClass: 3, medicalDaysRemaining: medicalDaysRemaining})
            } else {
                this.setState({medicalClass: 3, medicalDaysRemaining: 0, medicalClassFontColor: '#ff0000' })
            }
        } else if(this.props.pilotDocuments.medical_class == 'three') {
            if(!classThreeIsExpired) {
                let medicalDaysRemaining = Math.round((medicalDateDays + 730) - currentDateDays)
                this.setState({medicalClass: 3, medicalDaysRemaining: medicalDaysRemaining})
            } else {
                this.setState({medicalClass: 3, medicalDaysRemaining: 0, medicalClassFontColor: '#ff0000'})
            }
        } else {
            this.setState({medicalClass: "", medicalDaysRemaining: 0})
        }
    };


    renderMedicalClass = () => {
        //check if a Medical Class exists and render days, class and expire date
        if(this.state.medicalClass) {
            return (
                <div className="row" style={{color: this.state.medicalClassFontColor}}>
                    <div className="col-sm-3" id="medicalReview">
                        {
                            `${this.state.medicalDaysRemaining} days`
                        }
                    </div>
                    <div className="col-sm-4">
                        {`Medical Class ${this.state.medicalClass}`}
                    </div>
                    <div className="col-sm-4">
                        {
                            this.props.pilotDocuments.medical_date &&
                            `${dateFormat(this.props.pilotDocuments.medical_date, "longDate")}`
                        }
                    </div>
                </div>
            )
        } else {        //if no medical class render message
            return (
                <div className="row">
                    <div className="col-sm-12" id="medicalRequired" style={{color: 'Red'}}>
                        <FontAwesome name="plus-square-o" id="medical-tiny"/>
                        {`Medical Required `}
                    </div>
                </div>
            )
        }
    };

    render() {
        return (
            <div>
                <div className="row" id="pilot-documents">
                    <FontAwesome name="plane" id="plane-tiny"/>
                    <span className="col-sm-3" id="pilot-certificate-number">
                        {this.props.pilotDocuments.faa_certificate_number}
                    </span>
                    <div className="col-sm-4" id="pilot-certificate-text">
                        {`PILOT CERTIFICATE`}
                    </div>

                </div>

                <div className="row" style={{color: this.state.flightReviewFontColor}}>
                    <div className="col-sm-3" id="flightReview" >
                        {`${this.state.flightReviewDays} days`}
                    </div>
                    <div className="col-sm-4">
                        {`Flight Review`}
                    </div>
                    <div className="col-sm-4">
                        {
                            this.props.pilotDocuments.flight_review_date &&
                            `${dateFormat(this.props.pilotDocuments.flight_review_date, "longDate")}`}
                    </div>
                </div>
                <div className="row" id="medical-class">
                    { this.renderMedicalClass() }
                </div>

            </div>
        )
    }
}




export default PilotDocuments;