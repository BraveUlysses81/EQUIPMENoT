import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import SignupForm from './SignupForm'
import { connect } from 'react-redux'
import { memberQuickAddRequest } from '../../actions/customerActions'
import './signup.css'


class SignupDesk extends React.Component {

    static propTypes = {
        memberQuickAddRequest: PropTypes.func.isRequired
    }

    render() {
        const { memberQuickAddRequest } = this.props
        return (
            <div id="SignupDesk">
                <div className="row" >
                    <div className="col-md-4" >
                        <SignupForm  memberQuickAddRequest={memberQuickAddRequest}/>
                    </div>
                </div>
            </div>
        )
    }
}



export default connect(null, { memberQuickAddRequest })(SignupDesk);