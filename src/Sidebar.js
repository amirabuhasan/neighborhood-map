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

// handles nextPage toggling
  nextPage = () => {
    this.setState({
      currentPage: this.state.currentPage + 1
    })
  }

// handles prevPage toggling
  prevPage = () => {
    this.setState({
      currentPage: this.state.currentPage - 1
    })
  }

// Filters markers to 5 per page, and determines which markers to display on what page. Returns an array of markersToShow
  displayMarkers = () => {
    let markers = this.props.markers
    let resultsPerPage = 5
    let markersToShow = []
    // sets an index for each marker starting from 0 and ending with 20
    for (let i = 0; i < markers.length; i++) {
      markers[i].i = i
    }
    // loops through each marker, and determines which page to display the marker, based on the marker's index
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

  // handleClick = () => {
  //   google.maps.event.trigger(marker, "click")
  //   if (window.innerWidth < 980) {
  //     this.props.toggleNav()
  //   }
  // }

  render() {
    let markersToShow = this.displayMarkers()

    return (
      <div className="sidebar">
        {(this.props.mobileView == false &&
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
              <ul className="sidebar-listing" role="menu">
                {markersToShow.map(marker =>
                  marker
                  && (
                  <li
                    role="button"
                    tabIndex="0"
                    className="listing"
                    key={marker.id}
                    onClick={() => {
                      google.maps.event.trigger(marker, "click")
                      if (window.innerWidth < 980) {
                        this.props.toggleNav()
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key == "Enter") {
                        google.maps.event.trigger(marker, "click")
                        if (window.innerWidth < 980) {
                          this.props.toggleNav()
                        }
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
        )}
      </div>
    )
  }
}

export default Sidebar
