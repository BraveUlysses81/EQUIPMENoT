import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Button } from 'react-bootstrap'
import { getMemberships } from '../../actions/profileActions'
import { loginMember } from '../../actions/authActions'

class SelectMembership extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        errors: '',
        memberships: ''

    };

    componentWillMount() {
        this.props.getMemberships(this.props.user.person_id)
            .then( (data) => {
                if(data.data.length === 1) {
                    this.selectMember(data.data[0].membership_id)
                }
                this.setState({ memberships: data.data })

            })
            .catch((err) => {
                console.log(err)
            })
    }

    selectMember = (membership_id) => {

        this.props.loginMember(membership_id, this.props.user)
            .then(() => {
                this.context.router.history.push(`/`);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleClick = (membership_id) => {
        this.selectMember(membership_id)
    };

    renderMemberships = (key) => {

        const membership = this.state.memberships[key]

        return (
            <Button key={key} onClick={() => this.handleClick(membership.membership_id)} >
                <figure id="aircraft-list-figure">
                    <img className="dispatch-aircraft-thumbs" src={membership.school_logo} />
                     <figcaption id="registration-number-caption">
                        {membership.school_name }
                    </figcaption>
                </figure>
            </Button>
        )
    };

    render() {
        const { errors, memberships } = this.state

        const noMemberShips = (
            <div/>
        )

        const hasMemberships = (
            <div id="member-select">
                <h2>Select Membership</h2>
                <div className={ classnames("form-group", {'has-error': errors.form})}>
                    {
                        errors.form ? (
                            <span id="textfieldgroup-error" className="help-block">{errors.form }</span>) : (
                            <span id="textfieldgroup-error-none"/>)
                    }
                </div>
                <div>
                    {
                        memberships && Object.keys(memberships).map(this.renderMemberships)
                    }
                </div>
            </div>
        )

        return (
            <div id="ContactForm">
                {
                    memberships.length !== 0 ? hasMemberships : noMemberShips
                }
            </div>
        )
    }
}

SelectMembership.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps, { getMemberships, loginMember })(SelectMembership);