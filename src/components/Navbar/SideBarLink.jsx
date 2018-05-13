import React from 'react'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'

const SideBarLink = ({ pathName, labelName, icon }) => {
    return (
        <div>
            <ul className="nav nav-pills nav-stacked">
                <li>
                    <Link id="nav-icon"
                          to={{pathname: `${pathName}`, state: {modal: false}}} >
                                <FontAwesome name={icon} />
                                <br/> {labelName}
                    </Link>
                </li>
                <div id="left-nav-hr">
                    <hr style={{ width: '120px', marginLeft: '-2px' }}/>
                </div>
            </ul>
        </div>
    )
}

export default SideBarLink;