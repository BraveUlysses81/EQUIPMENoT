
import React from 'react'
import { render } from 'react-dom'
import { server } from '../../helpers/serverAddress'


class SignupSuccess extends React.Component {

    render (){
        return (
            <div id="WelcomeDesk" >

                <div id="welcome-equipmenot">
                <span id="welcome-equipmenot-head">Welcome to EQUIP.ME.NoT, Please check for a sms message on your mobile device for further instructions.</span>
                <br/>
                <div id="welcome-equipmenot-blurb">Visit <a href={server}>EQUIP.ME.NoT</a> to sign in.</div>
                </div>

            </div>
        )
    }
}

export default SignupSuccess;