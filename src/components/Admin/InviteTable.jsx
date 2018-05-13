
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { resendInvite } from '../../actions/adminActions';
import { connect } from 'react-redux';

class InviteTable extends React.Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        invites: PropTypes.object
    }

    state = {

    }

    resend = (invite) => {

        this.props.resendInvite(invite)
            .then( () => {

            })
            .catch( (err) => {

            })
    }

    renderInvites = (key) => {
        const invite = this.props.invites[key]

        const activeLink = () => {
            if (invite.onboarding_status === 'responded') {
                return (<Link to={{
                    pathname: `/modal/admin/invite/${invite.invite_id}`,
                    state: {modal: true} }} > Accept Invite
                </Link>)
            } else {
                return ('Waiting for response')
            }
        }

        return (
            <tr key={key}>
                <td>{invite.first_name}</td>
                <td>{invite.last_name}</td>
                <td>{invite.email}</td>
                <td>{invite.onboarding_status}</td>
                <td><input type="checkbox" checked={invite.invite_sent} readOnly /> </td>
                <td><button type="submit" onClick={() => this.resend(invite)} >Resend</button></td>
                <td>
                    {activeLink()}
                </td>
            </tr>
        )
    }

    render() {
        return(
            <div>
                <main id="admin-manage-invites-main" className="col-sm-9 col-md-10" >
                    <h1 id="admin-manage-invites-head">Manage Invites</h1>
                    <br/>
                    <div className="table-responsive">
                        <table className="table table-stripped">
                            <thead>
                            <tr id="admin-manage-invites-header-row">
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Invite Sent</th>
                                <th>Resend Invite</th>
                                <th>Accept Membership</th>
                            </tr>
                            </thead>

                            <tbody>
                                {
                                    Object.keys(this.props.invites).map(this.renderInvites)
                                }
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        )
    }
}

export default connect(null, { resendInvite })(InviteTable);