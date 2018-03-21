/*global google*/

import React, { Component } from 'react';

class Map extends Component {

  render() {
    return (
      <div className="map-container">
        <div id="map" tabIndex="-1">
        </div>
      </div>
    )
  }
}

export default Map
