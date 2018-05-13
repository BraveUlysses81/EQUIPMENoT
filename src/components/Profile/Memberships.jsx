import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { getMemberships } from '../../actions/profileActions'

class Memberships extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        memberships: '',
    };

    static propTypes = {
        person_id: PropTypes.number.isRequired,
        getMemberships: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.getMemberships(this.props.person_id)
            .then( (data) => {
                this.setState({ memberships: data.data })
            })
            .catch((err) => {
                console.log(err.response)
            })

    }

    renderMemberships = (key) => {
        const membership = this.state.memberships[key]
        return(
            <div key={key}>
                <ListGroupItem  id="profile-memberships-list-item" bsStyle="info">
                        {membership.school_name}
                </ListGroupItem>
            </div>
        )
    };

    render() {

        return(
            <div>
                <h3 id="profile-memberships-header">SCHOOL MEMBERSHIP</h3>
                <ListGroup id="profile-memberships-list">
                    {
                        Object.keys(this.state.memberships).map(this.renderMemberships)
                    }
                </ListGroup>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    person_id: state.user.person_id
});

export default connect(mapStateToProps, { getMemberships })(Memberships);