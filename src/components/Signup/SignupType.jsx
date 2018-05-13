
import React from 'react';
import { render } from 'react-dom'

class SignupType extends React.Component {
    state = {
        membership_type: ''
    }

    onClickStudent = () => {
        this.setState({membership_type: 'student'})
        this.props.showRegister('student')
    }

    onClickRenter = () => {
        this.setState({membership_type: 'renter'})
        this.props.showRegister('renter')
    }

    onClickInstructor = () => {
        this.setState({membership_type: 'instructor'})
        this.props.showRegister('instructor')
    }

    onClickEmployee = () => {
        this.setState({membership_type: 'employee'})
        this.props.showRegister('employee')
    }

    render () {
        return(
            <div>
                <button onClick={this.onClickStudent} id="signup-student-button">
                    <br/>
                        <div>
                            <div id="signup-student-button-text">I want to learn to fly.</div>
                        </div>
                </button>
                <button onClick={this.onClickRenter} id="signup-student-button">
                    <br/>
                        <div>
                            <div id="signup-student-button-text">I want to rent an airplane.</div>
                        </div>
                </button>
                <button onClick={this.onClickInstructor} id="signup-student-button">
                    <br/>
                        <div>
                            <div id="signup-student-button-text">I am a flight instructor.</div>
                        </div>
                </button>
                <button onClick={this.onClickEmployee} id="signup-student-button">
                    <br/>
                        <div>
                            <div id="signup-student-button-text">I am a school employee.</div>
                        </div>
                </button>

            </div>
        )
    }
}

export default SignupType;