import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from "./Sidebar"
import MapContainer from "./Map"

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Neighborhood Map
        </header>
        <div className="main-container">
          <div className="sidebar-container">
            <Sidebar></Sidebar>
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
