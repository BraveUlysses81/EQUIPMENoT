import React from 'react'
import { render } from 'react-dom'

class UserRoleTable extends React.Component {
    constructor(props) {
        super(props)
    }

    onChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const user = {...this.props.user}
        user[name] = value;

       this.props.onRoleChange(user)
    }

    render() {
        const { instructor_view_rights, dispatch_view_rights, admin_view_rights, first_name, last_name, username, member_view_rights } = this.props.user
        return(
                <tr key={this.props.userID} >
                    <td>{first_name}</td>
                    <td>{last_name}</td>
                    <td>{username}</td>
                    <td>
                        <input type="checkbox"
                               name="member_view_rights"
                               checked={member_view_rights}
                               onChange={this.onChange}
                        />
                    </td>
                    <td>
                        <input type="checkbox"
                               name="instructor_view_rights"
                               checked={instructor_view_rights}
                               onChange={this.onChange}
                        />
                    </td>
                    <td>
                        <input type="checkbox"
                               name="dispatch_view_rights"
                               checked={dispatch_view_rights}
                               onChange={this.onChange}
                        />
                    </td>
                    <td>
                        <input type="checkbox"
                               name="admin_view_rights"
                               checked={admin_view_rights}
                               onChange={this.onChange}
                        />
                    </td>
                </tr>
            )
    }
}

export default UserRoleTable;