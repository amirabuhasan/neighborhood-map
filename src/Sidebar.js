/*global google*/

import React, { Component } from 'react';
import Search from "./Search"

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1
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

  render() {
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
            {markers.map(marker =>
              marker.i >= resultsPerPage * this.state.currentPage - 5 && marker.i < resultsPerPage * this.state.currentPage
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
    )
  }
}

export default Sidebar
