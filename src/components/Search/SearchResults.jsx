import React from 'react';
import { render } from 'react-dom';



class SearchResults extends React.Component{

    constructor(props) {
        super(props);
    }

    renderResultList = (key) => {

        const result = this.props.resultList[key]

        return (

            <div id="search-results-text-item" key={key}>
                <li >
                    <a onClick={ () => this.props.handleSearchClick(result)}>
                    {`${result.first_name}  ${result.last_name} - ${result.type} `}
                    </a>
                </li>
            </div>
        )
    };

    render() {
        return (
            <div>
                <ul id="search-results-list">
                    {
                        Object.keys(this.props.resultList).sort().map(this.renderResultList)
                    }
                </ul>
            </div>
        );
    }
}

export default SearchResults

