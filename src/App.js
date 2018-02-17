/*global google*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from "./Sidebar"
import MapContainer from "./Map"

class App extends Component {
  state = {
    locations: [],
    markers: [],
    currentLocation: {}
  }

  componentDidMount() {
    window.map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(4.210483999999999, 101.97576600000002),
      zoom: 8
    });
  }

  createMarker = () => {
    this.state.locations.map((l) => new window.google.maps.Marker({
      map: window.map,
      position: {lat: l.geometry.location.lat(), lng: l.geometry.location.lng()}
    })
  }

  searchPlaces = () => {
    let self = this;
    let placesService = new google.maps.places.PlacesService(window.map);
    placesService.textSearch({
      query: document.getElementById("search-text").value,
      bounds: window.map.getBounds()
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        self.setState(state => ({
          currentLocation: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
        }))
        window.map.setCenter(self.state.currentLocation)
        self.serviceSearch()
        self.createMarker()
      }
    });
  }

  serviceSearch() {
    let service = new google.maps.places.PlacesService(window.map);
    service.nearbySearch({
      location: this.state.currentLocation,
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: ["car_repair"],
    }, this.callback)
  }

  callback = (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      this.setState({locations: results})
    }
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          Neighborhood Map
        </header>
        <div className="main-container">
          <div className="sidebar-container">
            <Sidebar
              searchPlaces={this.searchPlaces}
              >
              </Sidebar>
          </div>
          <div className="map-container">
            <MapContainer></MapContainer>
          </div>
        </div>
        <footer></footer>
      </div>
    );
  }
}

export default App;
