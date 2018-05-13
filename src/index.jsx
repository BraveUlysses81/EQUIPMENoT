
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import storeFactory from './store'
import setAuthorizationToken from './helpers/setAuthorizationToken'
import jwt from 'jsonwebtoken'
import { receiveLogin, memberSelection } from './actions/authActions'

import App from './App'

const store = storeFactory()


if(localStorage.jwtToken) {
    const user = jwt.decode(localStorage.getItem('jwtToken'));
    setAuthorizationToken(true);
    const member = jwt.decode(localStorage.getItem('member'));
    store.dispatch(receiveLogin(user));
    store.dispatch(memberSelection(member, user));
}

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root-App')
)