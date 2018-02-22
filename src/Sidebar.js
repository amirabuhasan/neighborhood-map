/*global google*/

import React, { Component } from 'react';
import Search from "./Search"

class Sidebar extends Component {

  render() {
    const {markers} = this.props
    return(
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h3>Find workshops near you</h3>
        </div>
        <Search
          searchPlaces={this.props.searchPlaces}
        />
        <div className="sidebar-listing-container">
          <ul className="sidebar-listing">
            {markers.map((marker) => (
              <li
                key={marker.id}
                onClick={() => {google.maps.event.trigger(marker, "click")}}
                >
                <p className="listing-name">{marker.name}</p>
                <p>{marker.distance}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Sidebar
