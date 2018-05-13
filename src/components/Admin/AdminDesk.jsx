import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import InviteTable from './InviteTable'
import UserRoleTable from './UserRoleTable'
import { LinkContainer } from 'react-router-bootstrap'
import { getAllInvites, getAllUsers, updateUserPermissions } from '../../actions/adminActions'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import './admin.css'

class AdminDesk extends React.Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        schoolId: PropTypes.number.isRequired,
        getAllInvites: PropTypes.func.isRequired,
        getAllUsers: PropTypes.func.isRequired
    };

    state = {
        invites: {},
        users: {},
        errors: ''
    };

    componentWillMount() {
        this.getInvites();
        this.getUsers();
        this.context.router.history.push(`/admin`)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.location.state) {
            if (nextProps.location.state.inviteID) {
                this.getInvites();
                this.getUsers()
            }
        }
    }

    getInvites = () => {
       this.props.getAllInvites(this.props.schoolId)
            .then((data) => {
            this.setState({ invites: {} });
                data.data.map((i) => {
                    const invites = {...this.state.invites};
                    //index customer and add to the customers array
                    invites[`${i.invite_id}`] = i;
                    //set state
                    this.setState({ invites })
                })
            })
            .catch((err) => {
                if(err.response) {
                    this.setState({ errors: {inviteTable: err.response.data}})
                }else {
                    this.setState({ errors: {inviteTable: 'Oops! Something went wrong.'}})
                }
            })
    };

    getUsers = () => {
        this.props.getAllUsers(this.props.schoolId)
            .then((data) => {
                data.data.map((i) => {
                    const users = {...this.state.users};
                    users[`${i.person_id}`] = i;
                    this.setState({ users })
                })
            })
            .catch((err) => {
                if(err.response) {
                    this.setState({ errors: {form: err.response.data}})
                }else {
                    this.setState({ errors: {form: 'Oops! Something went wrong.'}})
                }
            })
    };

    onRoleChange = (user) => {
        const users = {...this.state.users};

        this.props.updateUserPermissions(this.props.schoolId, user)
            .then(() => {
                users[user.person_id] = user;
                this.setState({ users })
            })
            .catch((err) => {
            console.log(err.response);
                if(err.response) {
                    this.setState({ errors: {userRoles: err.response.statusText}})
                }else {
                    this.setState({ errors: {userRoles: 'Oops! Something went wrong.'}})
                }
            })
    };

    render() {
        const { invites, users, errors } = this.state;
        return(
            <div id="AdminDesk">
                <Navbar id="customer-desk-nav" >
                        <Nav id="customer-desk-nav-item" >
                            <NavDropdown eventKey="1" title="Admin Tasks" id="customer-desk-nav-button">
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/add/customer`, state: {modal: false}}} >
                                    <MenuItem eventKey="1.1">
                                        <div id="quick-add-customer-button">
                                            Manage Invites
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/modal/${this.props.schoolId}/dispatch/`, state: {modal: true}}} >
                                    <MenuItem eventKey="1.2">
                                        <div id="quick-add-customer-button">
                                            Manage App Permission Groups
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                </Navbar>
                <section className="row text-center placeholders">
                    <div className={ classnames("form-group", {'has-error': errors.inviteTable})} >
                        {
                            !errors.inviteTable &&
                            <InviteTable invites={invites}/>
                        }
                        <div>
                            {
                                errors.inviteTable ?
                                    (<span id="textfieldgroup-error" className="help-block"><h2>{errors.inviteTable}</h2></span>)
                                    : (<span id="textfieldgroup-error-none">{errors.inviteTable}</span>)
                            }
                        </div>
                    </div>

                </section>
                <div>
                    <br />
                </div>
                <section className="row text-center placeholders">
                    <div>
                        <main id="admin-manage-invites-main" className="col-sm-9 col-md-10" >
                            <h1 id="admin-manage-invites-head">Manage App Permissions</h1>
                            <br/>
                            <div className="table-responsive" >
                                <div className={ classnames("form-group", {'has-error': errors.userRoles})} >
                                    {
                                        errors.userRoles ?
                                            (<span id="textfieldgroup-error" className="help-block"><h2>{errors.userRoles }</h2></span>)
                                            : (<span id="textfieldgroup-error-none">{errors.userRoles }</span>)
                                    }
                                </div>
                                <table className="table table-stripped">
                                    <thead>
                                    <tr id="admin-manage-invites-header-row">
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>User Name</th>
                                        <th>Member Group</th>
                                        <th>Instructor Group</th>
                                        <th>Dispatcher Group</th>
                                        <th>Admin Group</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Object.keys(users).map(key =>
                                             <UserRoleTable  user={users[key]}
                                                    key={key}
                                                     userID={key}
                                                    onRoleChange={this.onRoleChange} />
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </div>
                </section>
            </div>
        )
    }
}

AdminDesk.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    schoolId: state.member.school_id
});

export default connect(mapStateToProps, { getAllInvites, getAllUsers, updateUserPermissions })(AdminDesk);