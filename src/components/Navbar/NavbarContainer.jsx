import React from 'react'
import {render} from 'react-dom'
import { Link } from 'react-router-dom'
import SideBarLink from './SideBarLink'

// Navbar Left Section

class NavbarContainer extends React.Component {


    render () {

        const memberNavBar = (
            <div id="navCont" className="col-sm-1">
                <div className="navbar navbar-default navbar-fixed-left">
                    <Link id="logo" className="navbar-brand" to="/">
                        <img id="main-logo" src={ '/img/equipmenot.png' } />
                    </Link>
                </div>
            </div>
        );

        const dispatchNavBar = (
            <div id="navCont" className="col-sm-1">
                <div className="navbar navbar-default navbar-fixed-left">
                    <Link id="logo" className="navbar-brand" to="/">
                        <img id="main-logo" src={ '/img/equipmenot.png' } />
                    </Link>
                    <SideBarLink pathName="/dispatch"
                                 id="side-bar-link"
                                 labelName="Dispatch"
                                 icon="user-plus fa-2x"
                    />
                    <SideBarLink pathName="/customers"
                                 id="side-bar-link"
                                 labelName="Customers"
                                 icon="users fa-2x"
                    />
                    <SideBarLink pathName="/instructors"
                                 id="side-bar-link"
                                 labelName="Instructors"
                                 icon="paper-plane-o fa-2x"
                    />
                    <SideBarLink pathName="/aircraft"
                                 id="side-bar-link"
                                 labelName="Aircraft"
                                 icon="plane fa-2x"
                    />
                </div>
            </div>
        );

        const adminNavBar = (
            <div id="navCont" className="col-sm-1">
                <div className="navbar navbar-default navbar-fixed-left">
                    <Link id="logo" className="navbar-brand" to="/">
                        <img id="main-logo" src={ '/img/equipmenot.png' } />
                    </Link>
                    <SideBarLink pathName="/dispatch"
                                 id="side-bar-link"
                                 labelName="Dispatch"
                                 icon="user-plus fa-2x"
                    />
                    <SideBarLink pathName="/customers"
                                 id="side-bar-link"
                                 labelName="Customers"
                                 icon="users fa-2x"
                    />
                    <SideBarLink pathName="/instructors"
                                 id="side-bar-link"
                                 labelName="Instructors"
                                 icon="paper-plane-o fa-2x"
                    />
                    <SideBarLink pathName="/aircraft"
                                 id="side-bar-link"
                                 labelName="Aircraft"
                                 icon="plane fa-2x"
                    />
                    <SideBarLink pathName="/admin"
                                 id="side-bar-link"
                                 labelName="Admin"
                                 icon="fa fa-cog fa-2x"
                    />
                </div>
            </div>
        );

        {
            if (this.props.admin_view_rights) {
                return (
                    <div>{adminNavBar}</div>
                )
            } else if (this.props.dispatch_view_rights) {
                    return (
                        <div>{dispatchNavBar}</div>
                    )
            } else if (this.props.user_view_rights){
                return (
                    <div>{memberNavBar}</div>
                )
            } else {
                    return (
                        <div>{null}</div>
                    )
                }

        }
    }
}

export default NavbarContainer;


