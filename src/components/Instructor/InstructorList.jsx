
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../../components/UserPhoto'
import FontAwesome from 'react-fontawesome'


class InstructorList extends React.Component {
    constructor() {
        super()
    }

    static propTypes = {
        instructors: PropTypes.object.isRequired,
        selectInstructor: PropTypes.func.isRequired
    };
    numberPhoneCheck = (number) => {
        if(number) {
            const digit = (number.length.toString()[0]);
            if (number.length == 11 && digit === "1")
            {
                return (number.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4"))
            }
            else if (number.length == 10)
            {
                return (number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"))
            }
            else if (number.length == "")
            {
                return ('')
            }
            else
            {
                return ("NUMBER IS INVALID")
            }
        } else {
            return ('')
        }
    };

    renderInstructor = (key) => {
        const instructor = this.props.instructors[key]

        return(
            <div key={key}>
                <li id="customer-list-group" className="list-group-item">
                    <button id="customer-list-button" onClick={ () => this.props.selectInstructor(instructor) } style={{ color: 'lightgray' }}>
                        <div id="customer-list-image-wrap">
                            <div id="customer-image" >
                                <UserPhoto picture_url={instructor.profile} imageID="list-photo" thumbnailSize="user fa-2x"/>
                            </div>
                        </div>
                        <br/>
                        <div id="customer-list-info">
                            <div id="customer-list-name">
                                {
                                    instructor.first_name + ' ' + instructor.last_name
                                }
                            </div>
                            <div id="customer-list-contact-mobile">

                                <FontAwesome name="mobile" id="mobile-phone-tiny"/>
                                <span id="customer-list-contact-mobile-number">
                                    { ' ' + this.numberPhoneCheck(instructor.mobile) }
                                </span>

                                {/*Mobile:*/}
                                {/*{*/}
                                {/*' ' + instructor.mobile.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")*/}
                                {/*}*/}
                            </div>
                            <br/>
                            <div id="customer-list-contact">

                                <FontAwesome name="phone" id="phone-tiny"/>
                                <span id="customer-list-contact-phone-number">
                                    { ' ' + this.numberPhoneCheck(instructor.phone) }
                                </span>

                                {/*Phone:*/}
                                {/*{*/}
                                {/*' ' + instructor.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")*/}
                                {/*}*/}
                            </div>
                        </div>
                    </button>
                </li>
            </div>
        )
    };

    render() {
        return (
            <div id="customer-list" className="col-sm-3">
                <label id="customer-list-header">INSTRUCTORS</label>
                <ul className="list-group">
                    {
                        Object.keys(this.props.instructors).map(this.renderInstructor)
                    }
                </ul>
            </div>
        )
    }
}

export default InstructorList;