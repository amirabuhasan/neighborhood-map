/*global google*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from "./Sidebar"
import Map from "./Map"


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      places: [],
      markers: [],
      userMarker: [],
      currentLocation: {}
    }
    this.map;
  }

  // initializes the map. Checks for user's location, creates initial user marker and markers.
  componentDidMount() {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(4.210483999999999, 101.97576600000002),
      zoom: 6
    });

    this.checkUserLocation()
    this.createUserMarker()
    this.createMarkers()
  }

  // everytime the dom re-renders i.e. because user conducts a search,
  // clears all markers on the map, and creates new ones based on user's new location
  componentDidUpdate(previousProps, previousState) {
    if (previousState.places !== this.state.places) {
      this.state.userMarker.setMap(null)
      this.state.markers.map((marker) => {
        marker.setMap(null)
      })
      this.setState({ userMarker: [] })
      this.setState({ markers: [] })
      this.createUserMarker()
      this.createMarkers()
    }
  }

  // Checks a user's current location using the browser's gps.
  // Conducts a service search for workshops nearby by calling serviceSearch()
  checkUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          currentLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }, () => this.serviceSearch()
      )}, function() {
        alert("You denied access!");
      })
    }
  }

  // creates markers on the map for each location. Also adds click listeners.
  createMarkers = () => {
    let self = this
    let markers = []
    let bounds = new google.maps.LatLngBounds()
    var infowindow = new google.maps.InfoWindow()
    this.state.places.map((place) => {
      let marker = new window.google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        id: place.place_id,
        name: place.name,
        distance: place.distance
      })
      marker.addListener('click', function() {
       self.getPlacesDetails(this, infowindow)
      });
      markers.push(marker)
      bounds.extend(place.geometry.location)
    })
    this.setState({ markers: markers })
    this.map.fitBounds(bounds)
  }

  // Creates a marker to display user's current/searched location
  createUserMarker() {
    let image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
    let marker = new google.maps.Marker({
      position: this.state.currentLocation,
      title: "Your Location",
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6,
        strokeColor: '#fbfbfb',
        strokeOpacity: 0.4,
        fillOpacity: 1.0,
        fillColor: '#0096d7'
      }
    })
    this.setState({userMarker: marker})
  }


  // Get's the place details of a clicked marker, and appends it to the info windows.
  getPlacesDetails = (marker, infowindow) => {
    let service = new google.maps.places.PlacesService(this.map);
    let self = this
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
          innerHTML += `<br><br><div class="slider one-time">`

          innerHTML += '<div><img src="' + place.photos[0].getUrl(
              {maxHeight: 200, maxWidth: 300}) + '"></div>'

          innerHTML +="</div"
        }
        if (place.place_id) {
          innerHTML += `<div class="infowindow-button-container text-center">`
          if (place.formatted_phone_number) {
            innerHTML += "<hr>"
            innerHTML += `<button class="infowindow-buttons" type="button" onclick="window.open('tel:${place.formatted_phone_number}','_self')">
                          <i class="fas fa-phone" aria-hidden="true"></i><br>Call
                          </button>`
          }
          innerHTML += `<button class="infowindow-buttons" type="button" onclick="window.open('https://www.google.com/maps/search/?api=1&query=
                        ${place.geometry.location.lat()},${place.geometry.location.lng()}
                        &query_place_id=${place.place_id}');"><i class="fas fa-compass"
                        aria-hidden="true"></i><br>Get Directions
                        </button>`
          innerHTML += `<button class="infowindow-buttons" type="button" onclick=
                        "window.open('https://m.uber.com/ul/?action=setPickup&client_id=td2yBpJSiLMHMu3VfkHcZyy6jahPl5ar&pickup=my_location&dropoff
                        [nickname]=${place.name}&dropoff[latitude]=${place.geometry.location.lat()}&dropoff[longitude]=${place.geometry.location.lng()}');">
                        <i class="fab fa-uber" aria-hidden="true"></i><br>Order Uber
                        </button>`
          innerHTML += "</div>"
        }
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
        infowindow.open(self.map, marker);
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        })
      }
    })
  }

  // Conducts a text search using Google's textSearch, and set's the currentLocation
  // to the searched location. Also searches for nearby workshops by calling serviceSearch()
  searchPlaces = () => {
    let placesService = new google.maps.places.PlacesService(this.map);
    placesService.textSearch({
      query: document.getElementById("search-text").value,
      bounds: this.map.getBounds()
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.setState({
          currentLocation: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
        }, () => this.serviceSearch()
      )}
    })
  }

  // Searches for nearby workshops using Google's nearbySearch, and passes a callback method
  // to handle the results
  serviceSearch = () => {
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: this.state.currentLocation,
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: ["car_repair"],
    }, this.callback)
  }

  // Returns the results of the search and updates the places state with the results.
  // Also runs calculateDistance()
  callback = (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      results.map((result) => {
        this.calculateDistance(this.state.currentLocation.lat, this.state.currentLocation.lng,
                                result.geometry.location.lat(), result.geometry.location.lng(),
                                result)
      })
      this.setState({places: results})
    }
  }

  // calculates the distance between a place and a user's currentLocation
  calculateDistance = (originLat, originLng, destinationLat, destinationLng, location) => {
    let distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(originLat, originLng), new google.maps.LatLng(destinationLat, destinationLng));
    distance = (distance / 1000).toFixed(2);
    location.distance = distance + "km"
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Search for Car Workshops Around You
        </header>
        <div className="main-container">
          <Sidebar
            searchPlaces={this.searchPlaces}
            map={this.map}
            places={this.state.places}
            markers={this.state.markers}
            getPlacesDetails={this.getPlacesDetails}
            >
          </Sidebar>
          <Map></Map>
        </div>
        <footer></footer>
      </div>
    );
  }
}

export default App;
