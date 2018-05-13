import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types'

class DispatchFlightType extends React.Component {

    constructor(props){
        super(props)
    }

    static propTypes = {
        handleChange: PropTypes.func.isRequired,
        override: PropTypes.bool,
        hasCheckout: PropTypes.bool.isRequired,
        dual_only: PropTypes.bool.isRequired,
        hasCert: PropTypes.bool,
    };

    render(){

        return(
            <div>
                { (!this.props.hasCheckout || !this.props.hasStudentSolo) &&

                    (


                <div id="dispatch-flight-info-container">

                    <div className="col-sm-3">
                        <input name="checkout"
                               id="postflight-squawk-ground-flight-input"
                               type="checkbox"
                               onChange={this.props.handleChange}
                        />
                        <label id="dispatch-flight-info-label">Aircraft Checkout
                        </label>
                    </div>

                    <div className="col-sm-3">
                        <input name="ifr_checkout"
                               id="postflight-squawk-ground-flight-input"
                               type="checkbox"
                               onChange={this.props.handleChange}
                        />
                        <label id="dispatch-flight-info-label">IFR Checkout
                        </label>
                    </div>

                    <div className="col-sm-3">
                        <input name="flight_review"
                               id="postflight-squawk-ground-flight-input"
                               type="checkbox"
                               onChange={this.props.handleChange}
                        />
                        <label id="dispatch-flight-info-label">Flight Review
                        </label>
                    </div>
                    <div className="col-sm-3">
                        <input name="checkride"
                               id="postflight-squawk-ground-flight-input"
                               type="checkbox"
                               onChange={this.props.handleChange}
                        />
                        <label id="dispatch-flight-info-label">Checkride
                        </label>
                    </div>

                </div>
                    )
                }




                    {
                        (!this.props.dual_only) && ((this.props.hasCheckout || this.props.hasStudentSolo) || this.props.override) &&
                        (
                            <div>
                                <div id="dispatch-flight-info-subcontainer">

                                    <div id="dispatch-flight-info-text" className="col-sm-4">
                                        <input name="local-flight"
                                               id="postflight-squawk-ground-flight-input"
                                               type="checkbox"
                                               onChange={this.props.handleChange}
                                        />
                                        <label id="dispatch-flight-info-label">Local Flight
                                        </label>
                                    </div>

                                    <div id="dispatch-flight-info-text" className="col-sm-4">
                                        <input name="cross_country"
                                               id="postflight-squawk-ground-flight-input"
                                               type="checkbox"
                                               onChange={this.props.handleChange}
                                        />
                                        <label id="dispatch-flight-info-label">Cross Country
                                        </label>
                                    </div>
                                    <div id="dispatch-flight-info-text" className="col-sm-4">
                                        <input name="solo"
                                               id="postflight-squawk-ground-flight-input"
                                               type="checkbox"
                                               onChange={this.props.handleChange}
                                        />
                                        <label id="dispatch-flight-info-label">Student Solo
                                        </label>
                                    </div>

                                </div>

                                <div id="dispatch-flight-info-subcontainer">

                                    <div id="dispatch-flight-info-text" className="col-sm-4">
                                        <input name="flight-plan"
                                               id="postflight-squawk-ground-flight-input"
                                               type="checkbox"
                                               onChange={this.props.handleChange}
                                        />
                                        <label id="dispatch-flight-info-label">Flight Plan
                                        </label>
                                    </div>

                                    <div id="dispatch-flight-info-text" className="col-sm-4">
                                        <input name="weather"
                                               id="postflight-squawk-ground-flight-input"
                                               type="checkbox"
                                               onChange={this.props.handleChange}
                                        />
                                        <label id="dispatch-flight-info-label">Weather
                                        </label>
                                    </div>

                                    <div id="dispatch-flight-info-text" className="col-sm-4">
                                        <input name="weight-balance"
                                               id="postflight-squawk-ground-flight-input"
                                               type="checkbox"
                                               onChange={this.props.handleChange}
                                        />
                                        <label id="dispatch-flight-info-label">Weight & Balance
                                        </label>
                                    </div>

                                </div>

                            </div>

                        )
                    }






            </div>
        )
    }
}

export default DispatchFlightType;