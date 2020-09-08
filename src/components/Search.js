import React from 'react';
import "../Stylesheet/Search.css";
import axios from 'axios';
import loader from '../loader.gif'
import PageNavigation from './PageNavigation'

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            totalResults: 0,
            totalPages: 0,
            currentPage: 0,
        };

        this.cancel = '';
    }

    getPageCount = ( total, denominator ) => {
        const divisible = 0 === total % denominator;
        const valueToBeAdded = divisible ? 0 : 1;
        return Math.floor( total/denominator ) + valueToBeAdded;
    }

    fetchSearchResults = (updatedPageNumber = '', query) => {
        const pageNumber = updatedPageNumber ? `&page=${updatedPageNumber}` : '';
        const searchUrl = `https://pixabay.com/api/?key=18186930-32a444d23ddf920671f950735&q=${query}${pageNumber}`

        if(this.cancel){
            this.cancel.cancel();
        }

        this.cancel = axios.CancelToken.source();

        axios.get(searchUrl, {
            cancelToken: this.cancel.token
        }) .then( res => {
            const total = res.data.total;
            const totalPagesCount = this.getPageCount( total, 20 );
            const resultNotFoundMsg = !res.data.hits.length
                                    ? 'There are no more search results'
                                    : '';
            this.setState ({ 
                results: res.data.hits,
                message: resultNotFoundMsg,
                totalResults: total,
                totalPages: totalPagesCount,
                currentPage: updatedPageNumber,
                loading: false
            })
        }) .catch( error => {
            if(axios.isCancel(error) || error){
                this.setState({
                    loading: false,
                    message: "Failed to fetch the data"
                })
            }
        })
    };

    handleOnInputChange = (event) => {
        const query = event.target.value;
        if ( !query ){
            this.setState({query, result: {}, message: ''})
        } else{
            this.setState( 
                { 
                query: query,
                loading: true,
                message: ''
                }, () => {
                    this.fetchSearchResults(1, query);
                } 
            )
        }
    };

    handlePageClick = ( type ) => {
        event.preventDefault();
        const updatePage = 'prev' === type 
            ? this.state.currentPage - 1 
            : this.state.currentPage + 1;

        if ( !this.state.loading ){
            this.setState( {loading: true, message: ''}, () => {
                this.fetchSearchResults( updatePage, this.state.query )
            } )
        }
    }

    renderSearchResults = () => {
        const { results } = this.state;
        if( Object.keys( results ).length && results.length){
            return (
                <div className="result-container">
                    { results.map( result => {
                        return (
                            <a key={ result.id } href= { result.previewURL } className="result-item">
                                <h6 className="image-username">{result.username}</h6>
                                <div className="image-wrapper">
                                    <img className="image" src={ result.previewURL } alt={ `${result.username} image` }/>
                                </div>
                            </a>
                        )
                        
                    })}
                </div>
            )
        }
    }

    render(){
        const { query, loading, message, currentPage, totalPages } = this.state;
        
        const showPrevLink = 1 < currentPage;
        const showNextLink = totalPages > currentPage;

        return (
            <div className="container">
                {/* Heading */}
                <h2 className="heading">Responsive Search</h2>
                {/* Search Input */}
                <label className="search-label" htmlFor="search-input">
                    <input
                        type="text"
                        name="query"
                        value={query}
                        id="search-input"
                        placeholder="search.."
                        onChange={this.handleOnInputChange}
                    />
                    <i class="fa fa-search search-icon" aria-hidden="true" />
                </label>

                {/* Error Message */}
                {message && <p className="message">{ message }</p>}

                {/* Loader */}
                <img src={loader} className={`search-loading ${ loading ? 'show' : 'hide'}`} alt="loader" />

                <PageNavigation 
                    loading = {loading}
                    showPrevLink = {showPrevLink}
                    showNextLink = {showNextLink}
                    handlePrevClick = { () => this.handlePageClick('prev', event)}
                    handleNextClick = { () => this.handlePageClick('next', event)}
                />

                {/* Result */}
                    {this.renderSearchResults()}

                <PageNavigation 
                    loading = {loading}
                    showPrevLink = {showPrevLink}
                    showNextLink = {showNextLink}
                    handlePrevClick = { () => this.handlePageClick('prev', event)}
                    handleNextClick = { () => this.handlePageClick('next', event)}
                />
            </div>
        )
    }
}

export default Search;