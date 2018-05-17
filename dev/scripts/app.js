import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Chart from './Chart.js';
import Qs from 'qs';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      locationEntered: [],
      location: ''
    }
    this.changeHandler = this.changeHandler.bind(this);
    this.enterLocation = this.enterLocation.bind(this);
  }


  componentDidMount(){
  //google places api
    axios({
      url: "http://proxy.hackeryou.com",
      method: "GET",
      dataResponse: "json",
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
          key: 'AIzaSyB28C8y1EV7AEymUE7bT5OPoRcbDCDHnaY',
          address: 'Toronto'
        },
        proxyHeaders:{
          'headers_params': 'value'
        },
        xmlToJSON: false
      }
      }).then((res) => {
        console.log(res.data.results[0].geometry.location);
      });

  //wunderground api
    axios.get('http://api.wunderground.com/api/28cbe1ca6cde9931/history_20160405/geolookup/q/43.6532,-79.3832.json')
    .then((res) => {
      console.log(res.data);
    })
  }


  changeHandler(e){
    console.log(e.target.value)
    this.setState({
      location: e.target.value
    })
  }
  enterLocation(e){
    e.preventDefault();
    const locationClone = Array.from(this.state.locationEntered);
    locationClone.push(this.state.location);
    this.setState({
      locationEntered: locationClone
    })
    console.log('entered');
  }
  render() {
    return (
      <div>
        <form action="">
          <input type="text" name='place' onChange={this.changeHandler} value={this.state.location}/>
          <button onClick={this.enterLocation}>Enter your location</button>
        </form>
        <Chart legendPosition='bottom'/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


//get user input of the day of travel and location
//pull weather history from wunderground for the day but from previous years and location of the place
//display as 24hrs - maybe for a few years
//add google directions