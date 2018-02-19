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
        <p className="text">Search for nearby workshops around a location</p>
        <input id="search-text" type="text" placeholder="Ex: Petaling Jaya" />
        <input type="button"
          value="Go"
          onClick={this.props.searchPlaces}
        />
      </div>
    )
  }
}

export default Search
