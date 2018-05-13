import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import SearchResults from './SearchResults'
import { connect } from 'react-redux'
import axios from 'axios'
import { server } from '../../helpers/serverAddress'

class SearchBar extends React.Component {
    state = {
        searchString: '',
        showSearch: false,
        libraries: ''
    };

    constructor(props) {
        super(props);
    }

    static propTypes = {
        school_id: PropTypes.number
    };

    handleChange = (e) => {
        let searchString = e.target.value;
        this.setState({searchString : searchString});
        this.getSearchResults(searchString);

        //check if search is empty and reset show search
        if(!searchString){
            this.setState({
                showSearch: false
            })
        }
        else{
            this.setState({
                showSearch: true
            })
        }
    };

    getSearchResults = (searchString) => {
        if(searchString) {

            this.setState({libraries: ''});
            axios.get(`${server}/search/${this.props.school_id}/${searchString.toLowerCase()}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }} )
                .then((object) => {

                    object.data.map((i) => {
                        // update our state
                        const libraries = {...this.state.libraries};
                        //index customer and add to the customers array
                        libraries[`${i.pkid}-${i.type}`] = i;
                        // set state
                        this.setState({libraries});
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    };

    handleSearchClick = (result) => {
        //clear search results
        //this.updateShowSearch()
        this.setState({showSearch: false, searchString: '' });
        //push result set to the router
        this.context.router.history.push({pathname: `/${result.type}/`, state: {id:`${result.pkid}` }} )
    };

    render(){
        return (
            <form className="navbar-form">
                <div id="search-group" className="input-group">
                     <span className="input-group-addon">
                        <i className="glyphicon glyphicon-search"></i>
                    </span>
                    <input type="text"
                           id="search-bar"
                           value={this.state.searchString}
                           onChange={this.handleChange}
                           className="form-control dropdown-toggle"
                           placeholder=" Search"
                           autoComplete="off"
                           disabled={this.props.disabled}/>

                    <br/>

                    {   this.state.showSearch &&
                    <SearchResults id="search-bar" placeholder=" Search"
                                   resultList={ this.state.libraries }
                                   handleSearchClick={this.handleSearchClick}
                    />
                    }
                </div>
            </form>
        )
    }
}

SearchBar.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        school_id: state.member.school_id
    }
};

export default connect(mapStateToProps)(SearchBar)