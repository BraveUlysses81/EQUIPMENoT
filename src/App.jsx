import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import ModalSwitch from './ModalSwitch'
import Header from './components/Header/Header'
import NavbarContainer from './components/Navbar/NavbarContainer'

import { connect } from 'react-redux'
import 'font-awesome/css/font-awesome.css'
import './components/style.css'




class App extends React.Component {
    render () {
        return (
            <Router>
                <div>
                    <Header />
                    <div className="container-fluid">
                        <div className="row">
                            <NavbarContainer
                                user_view_rights={this.props.user_view_rights}
                                member_view_rights={this.props.user_view_rights}
                                dispatch_view_rights={this.props.dispatch_view_rights}
                                instructor_view_rights={this.props.instructor_view_rights}
                                admin_view_rights={this.props.admin_view_rights}
                            />
                            <Route component={ModalSwitch} />
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}

const mapStateToProps = state =>
    ({
        user_view_rights: (!!state.isAuthenticated),
        member_view_rights: (state.member ? state.member.member_view_rights : false),
        dispatch_view_rights: (state.member ? state.member.dispatch_view_rights : false),
        instructor_view_rights: (state.member ? state.member.instructor_view_rights : false),
        admin_view_rights: (state.member ? state.member.admin_view_rights : false)
    });

export default connect(mapStateToProps)(App);