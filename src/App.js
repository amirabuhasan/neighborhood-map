/*global google*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from "./Sidebar"
import MapContainer from "./Map"


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      markers: [],
      currentLocation: {}
    }
  }

  componentDidMount() {
    window.map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(4.210483999999999, 101.97576600000002),
      zoom: 6
    });
    this.checkUserLocation()
  }

  componentDidUpdate(previousProps, previousState) {
    window.map.setCenter(this.state.currentLocation)
    if (previousState.locations !== this.state.locations) {
      this.state.markers.map((marker) => {
        marker.setMap(null)
      })
      this.setState({ markers: [] })
      this.createMarker()
    }
  }

  checkUserLocation() {
    const self = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        self.setState({
          currentLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }, () => self.serviceSearch()
      )}, function() {
        alert("You denied access!");
      })
    }
  }

  createMarker = () => {
    let markers = []
    let self = this
    let bounds = new google.maps.LatLngBounds()
    this.state.locations.map((location) => {
      let marker = new window.google.maps.Marker({
        map: window.map,
        position: location.geometry.location,
        id: location.place_id,
        name: location.name
      })
      var infowindow = new google.maps.InfoWindow()
       marker.addListener('click', function() {
        self.getPlacesDetails(this, infowindow)
      });
      markers.push(marker)
      bounds.extend(location.geometry.location)
    })
    this.setState({markers: markers})
    window.map.fitBounds(bounds);
  }


  getPlacesDetails = (marker, infowindow) => {
    let service = new google.maps.places.PlacesService(window.map);
    service.getDetails({
      placeId: marker.id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var innerHTML = `<div class="map-info-window" id="${place.id}" name="${place.id}">`;
        if (place.name) {
          innerHTML += '<strong>' + place.name + '</strong>';
        }
        if (place.formatted_address) {
          innerHTML += '<br>' + place.formatted_address;
        }
        if (place.photos) {
          innerHTML += `<br><br><div class="swiper-container"><div class="swiper-wrapper">`
          for (let i = 0; i < place.photos.length; i++){
            innerHTML += '<div class="swiper-slide"><img src="' + place.photos[i].getUrl(
                {maxHeight: 200, maxWidth: 300}) + '"></div>';
          }
          innerHTML += `</div><div class="swiper-pagination"></div>`
          innerHTML +="</div>";
        }
        if (place.place_id) {
          innerHTML += `<div class="infowindow-button-container text-center">`
          if (place.formatted_phone_number) {
            innerHTML += "<hr>"
            innerHTML += `<button class="infowindow-buttons" type="button" onclick="window.open('tel:${place.formatted_phone_number}','_self')"><i class="fas fa-phone" aria-hidden="true"></i><br>Call</button>`
          }
          innerHTML += `<button class="infowindow-buttons" type="button" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}&query_place_id=${place.place_id}');"><i class="fas fa-compass  " aria-hidden="true"></i><br>Get Directions</button>`
          innerHTML += `<button class="infowindow-buttons" type="button" onclick="window.open('https://m.uber.com/ul/?action=setPickup&client_id=td2yBpJSiLMHMu3VfkHcZyy6jahPl5ar&pickup=my_location&dropoff[nickname]=${place.name}&dropoff[latitude]=${place.geometry.location.lat()}&dropoff[longitude]=${place.geometry.location.lng()}');"><i class="fab fa-uber" aria-hidden="true"></i><br>Order Uber</button>`
          innerHTML += "</div>"
        }
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
        infowindow.open(window.map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        })
      }
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
        self.setState({
          currentLocation: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
        }, () => self.serviceSearch()
      )}
    })
  }

  serviceSearch = () => {
    let service = new google.maps.places.PlacesService(window.map);
    service.nearbySearch({
      location: this.state.currentLocation,
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: ["car_repair"],
    }, this.callback)
  }

  callback = (results, status) => {
    let self = this
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
              map={window.map}
              locations={this.state.locations}
              markers={this.state.markers}
              newMarker={window.newMarker}
              getPlacesDetails={this.getPlacesDetails}
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
