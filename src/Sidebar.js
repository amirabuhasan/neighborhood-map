/*global google*/

import React, { Component } from 'react';

class Sidebar extends Component {
  componentDidMount() {
    const searchBox = new google.maps.places.SearchBox(
      document.getElementById("search-text")
    );
  }
  render() {
    return(
      <div>
        <div className="sidebar-header">
          <h3>Find workshops near you</h3>
        </div>
        <div className="sidebar-search">
          <p className="text">Search for nearby workshops around a location</p>
          <input id="search-text" type="text" placeholder="Ex: Petaling Jaya" />
          <input type="button"
            value="Go"
            onClick={this.props.searchPlaces}
          />
        </div>
        <div className="sidebar-listing">

        </div>
      </div>
    )
  }
}

export default Sidebar
