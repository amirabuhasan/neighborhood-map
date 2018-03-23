/*global google*/

import React, { Component } from 'react';

class Search extends Component {
  componentDidMount() {
    const searchBox = new google.maps.places.SearchBox(
      document.getElementById("search-text")
    )
  }

  render() {
    return (
      <div className="sidebar-search">
        <h5 className="sidebar-search-header">Search for nearby workshops around a location</h5>
        <input id="search-text" role="search" aria-labelledby="sidebar-search-header" type="text" placeholder="Ex: Petaling Jaya" />
        <input
          className="sidebar-button"
          type="button"
          value="Go"
          onClick={this.props.searchPlaces}
        />
      </div>
    )
  }
}

export default Search
