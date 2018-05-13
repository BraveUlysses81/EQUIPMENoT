import React from 'react';
import SignupRegister from './SignupRegister'
import SignupType from './SignupType'

class SignupForm extends React.Component {

    static propTypes = {
        memberQuickAddRequest: React.PropTypes.func.isRequired,
    }

    state = {
        showRegister: false,
        membership_type: ''
    }

    constructor(props) {
        super(props)
    }

    showRegister = (membership_type) => {
        this.setState({ showRegister: true, membership_type} )
    }

    render() {
        const { membership_type } = this.state
        return (
            <div id="signup-register-container">
                <div>
                    <h1 id="signup-register-text">Tell us what brings you to EQUIP.ME.NoT?</h1>

                    <br/>
                    {
                        !this.state.showRegister &&
                        <SignupType showRegister={this.showRegister} />
                    }
                    <br/>
                    {
                        this.state.showRegister &&
                        <SignupRegister memberQuickAddRequest={this.props.memberQuickAddRequest}
                                       membership_type={membership_type}
                        />
                    }
                </div>
            </div>
        )
    }
}

SignupForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default SignupForm;