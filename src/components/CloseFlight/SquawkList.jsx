
import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import dateFormat from 'dateformat'


class SquawkList extends React.Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        squawks: PropTypes.object.isRequired,
        selectSquawk: PropTypes.func.isRequired
    };


    isSquawk = (squawk) => {
        // let isSquawk = Object.keys(this.state.flight).map(key => this.state.flight[key].entry_date)
        if ( squawk.entry_date == null ) {
            return ( '' )
        }
        else return (dateFormat (squawk.entry_date, "fullDate"))
    };

    renderSquawk = (key) => {
        const squawk = this.props.squawks[key]

        return(
            <div key={key}>
                <li id="postflight-squawk-list-item" className="list-group-item">

                    <button id="postflight-squawk-button" onClick={ () => this.props.selectSquawk(squawk) } style={{ color: 'lightgray' }}>

                    <div id="postflight-squawk-object">
                        <div id="postflight-squawk-reported">
                            <span id="postflight-squawk-reported-name">
                                { squawk.first_name } { squawk.last_name }
                            </span>
                            <span id="postflight-squawk-reported-date">
                                {/*{ this.isSquawk(flight) }*/}
                                { this.isSquawk(squawk) }
                            </span>
                        </div>
                        <br/>
                        <div id="postflight-squawk-report">
                            <span id="postflight-squawk-report-text">
                            "{ squawk.report }"
                            </span>
                        </div>
                    </div>

                    </button>

                        {/*<br/>*/}
                        {/*<div >*/}
                            {/*<div >*/}
                                {/*{ squawk.report }*/}
                            {/*</div>*/}
                            {/*<div >*/}

                                {/*<span >*/}
                                    {/*{ squawk.reporter_reference_id }*/}
                                {/*</span>*/}

                            {/*</div>*/}
                            {/*<br/>*/}
                            {/*<div >*/}

                                {/*<span >*/}
                                    {/*{ squawk.entry_date }*/}
                                {/*</span>*/}

                            {/*</div>*/}
                        {/*</div>*/}

                </li>
            </div>
        )
    };

    render() {
        return (
            <div>
                <label id="postflight-squawks-text">SQUAWKS</label>
                <ul id="postflight-squawks-list" className="list-group">
                    {
                        Object.keys(this.props.squawks).map(this.renderSquawk)
                    }
                </ul>
            </div>
        )
    }
}

export default SquawkList;