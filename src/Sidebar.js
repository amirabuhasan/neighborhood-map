/*global google*/

import React, { Component } from 'react';
import Search from "./Search"

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      markers: []
    }
  }

  nextPage = () => {
    this.setState({
      currentPage: this.state.currentPage + 1
    })
  }
  prevPage = () => {
    this.setState({
      currentPage: this.state.currentPage - 1
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.markers !== this.state.markers) {
      this.setState({markers: nextProps.markers})
    }
  }

  displayMarkers = () => {
    let markers = this.state.markers
    let resultsPerPage = 5
    let markersToShow = []
    for (let i = 0; i < markers.length; i++) {
      markers[i].i = i
    }
    markers.map(marker => {
      if (marker.i >= resultsPerPage * this.state.currentPage - 5 && marker.i < resultsPerPage * this.state.currentPage) {
        markersToShow.push(marker)
        marker.setMap(this.props.map)
      } else {
        marker.setMap(null)
      }
    })
    return markersToShow
  }

  render() {
    let markersToShow = this.displayMarkers()
    console.log(markersToShow)
    const {markers} = this.props
    for (let i = 0; i < markers.length; i++) {
      markers[i].i = i
    }
    let resultsPerPage = 5
    return(
      <div className="sidebar-container">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <h3>Find workshops near you</h3>
          </div>
          <Search
            searchPlaces={this.props.searchPlaces}
          />
        </div>
        <div className="sidebar-listing-container">
          <ul className="sidebar-listing">
            {markersToShow.map(marker =>
              marker
              && (
              <li
                className="listing"
                key={marker.id}
                onClick={() => {
                  google.maps.event.trigger(marker, "click")
                  if (window.innerWidth < 980) {
                    this.props.toggleNav()
                  }
                }}
                >
                <p className="listing-name">{marker.name}</p>
                <span><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                <span> {marker.distance}</span>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {this.state.currentPage > 1 && (
              <button onClick={this.prevPage}>Previous</button>
            )}
            {this.state.currentPage < 4 && (
              <button onClick={this.nextPage}>Next</button>
            )
            }
            <p>{this.state.currentPage}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
