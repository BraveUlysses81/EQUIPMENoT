import React from 'react'
import { render } from 'react-dom'
import FontAwesome from 'react-fontawesome'
import UserPhoto from '../Customer/UserPhoto'

// Individual Customer Component

class Instructor extends React.Component {
    constructor() {
        super();
    }

    render () {
        return(
            <div>
                <li id="customer-list-group" className="list-group-item">
                    <div  onClick={ () => this.props.renderInstructorDetail( this.props.instructor) } style={{ color: 'lightgray' }}>
                        <div id="customer-image">
                            <button type="button" className="btn btn-inverse pull-left" id="user-image-thumbnail">
                                <UserPhoto picture_url={this.props.instructor.picture_url} imageID="list-photo" thumbnailSize="user fa-2x"/>

                            </button>
                        </div>
                        <div id="customer-list-name">
                            { this.props.instructor.first_name + ' ' + this.props.instructor.last_name }
                        </div>
                        <div id="customer-list-contact">
                            Mobile:
                            {
                                this.props.instructor.mobile ? this.props.instructor.mobile.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") : " "
                            }
                        </div>
                        <div id="customer-list-contact">
                            Phone:
                            {
                                this.props.instructor.phone ? this.props.instructor.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") : " "
                            }
                        </div>
                    </div>
                </li>
            </div>
        )
    }
}

export default Instructor;