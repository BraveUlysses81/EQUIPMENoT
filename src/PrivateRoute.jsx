import React from 'react'
import { render } from 'react-dom'
import { Route, Redirect } from 'react-router-dom'




const PrivateRoute = ({ isAuthenticated, user_view_rights, member_view_rights, dispatch_view_rights, instructor_view_rights, admin_view_rights, allowedViewRights, component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated && Object.keys(allowedViewRights).some((key) => {
                if(user_view_rights && allowedViewRights[key] === 'user') {
                    return true;
                } else if(member_view_rights && allowedViewRights[key] === 'member'){
                    return true;
                } else if(dispatch_view_rights && allowedViewRights[key] === 'dispatch') {
                    return true;
                } else if (instructor_view_rights && allowedViewRights[key] === 'instructor' ) {
                    return true;
                } else if (admin_view_rights && allowedViewRights[key] === 'admin') {
                    return true;
                } else {
                    return false
                }
            })
        ?
            (<Component {...props} /> )
        :
            (<Redirect to={{
                pathname: `/`,
                state: {from: props.location}
            }}/>
        )
    )}/>
);


export default PrivateRoute;

