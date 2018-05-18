import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Chart from './Chart.js';
import Qs from 'qs';
import 'react-dates/initialize';
// import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker, DayPickerRangeController } from 'react-dates';


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      locationEntered: '',
      location: '',
      locationName: '',
      date: '',
      dateEntered: '',
      observationHoursArray: [],
      //chart states
      chartData: {}
    };
    this.changePlaceHandler = this.changePlaceHandler.bind(this);
    this.enterInputs = this.enterInputs.bind(this);
    this.changeDateHandler = this.changeDateHandler.bind(this);
  }

  componentWillMount(){
    this.getChartData();
  }
  getChartData(){
    this.setState({
      chartData: {
        labels: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
        datasets: [
          {
            label: 'Population',
            data: [
              617594,
              181045,
              153060,
              106519,
              105162,
              95072
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
            // [
            //   'rgba(255, 99, 132, 0.6)',
            //   'rgba(54, 162, 235, 0.6)',
            //   'rgba(255, 206, 86, 0.6)',
            //   'rgba(75, 192, 192, 0.6)',
            //   'rgba(153, 102, 255, 0.6)',
            //   'rgba(255, 159, 64, 0.6)',
            //   'rgba(255, 99, 132, 0.6)'
            // ]
          }
        ]
      }
    });
  }

  // componentWillMount(){

  // }
  // componentDidMount(){

    

  // }
  // componentWillReceiveProps(){

  // }
  // shouldComponentUpdate(){

  // }
  // componentWillUpdate(){

  // }
  // componentDidMount(){

  // }
  // componentWillUnmount(){

  // }

  getCords(inputAddress, inputDate){
    console.log(inputAddress);
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
          address: inputAddress
        },
        proxyHeaders: {
          'headers_params': 'value'
        },
        xmlToJSON: false
      }
    }).then((res) => {
      console.log(res.data.results[0].geometry.location);
      const cords = res.data.results[0].geometry.location;
      this.getWeather(cords, inputDate)
    });
  }
  
  getWeather(cords, inputDate){
    //wunderground api
    axios.get(`http://api.wunderground.com/api/28cbe1ca6cde9931/history_2016${inputDate}/geolookup/q/${cords.lat},${cords.lng}.json`)
      .then((res) => {
        // console.log(res.data);

        const weatherObservationsTotal = res.data.history.observations;

        //array of all the hours in the day
        let weatherObservationsArray = [];
        //loops through and grabs all the hour updates
        for (let i = 0; i < weatherObservationsTotal.length; i++){
          weatherObservationsArray.push(weatherObservationsTotal[i].date.hour)
        };
        
        //array of all the temp in the hours
        let tempPerHourArray = [];
        //loops through and grabs all the temp for everyhour
        for (let i = 0; i < weatherObservationsTotal.length; i++){
          tempPerHourArray.push(weatherObservationsTotal[i].tempm)
        };
        // console.log(tempPerHourArray);
        
        //clones the object
        const chartDataClone = Object.assign({}, this.state.chartData);
        //updates the labels to hours
        chartDataClone.labels = weatherObservationsArray;
        //updates the bargraph values
        chartDataClone.datasets[0].data = tempPerHourArray;
        //grabs the location name 
        const newLocationName = res.data.location.city;

        this.setState ({
          locationName: newLocationName,
          chartData: chartDataClone
        });
      })
  }

  changePlaceHandler(e){
    this.setState({
      location: e.target.value,
    })
  }
  changeDateHandler(e) {
    this.setState({
      date: e.target.value
    })
  }
  
  
  enterInputs(e){
    e.preventDefault();

    const locationClone = this.state.location;
    const dateClone = this.state.date;
    this.setState({
      locationEntered: locationClone,
      dateEntered: dateClone
    })
    console.log('entered');

    // this.getCords(this.state.locationEntered);
    setTimeout(() => this.getCords(this.state.locationEntered, this.state.dateEntered), 1000); 

  }
  render() {

    return (
      <div>
        <form action="" onSubmit={this.enterInputs}>
          <input type="text" name='place' onChange={this.changePlaceHandler} value={this.state.location}/>
          {/* <SingleDatePicker
            date={this.state.date} // momentPropTypes.momentObj or null
            onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
            focused={this.state.focused} // PropTypes.bool
            onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
          /> */}
          <input type="text" name='date' onChange={this.changeDateHandler} value={this.state.date}/>
          <button>Enter your location</button>
        </form>
        <Chart chartData={this.state.chartData} legendPosition='bottom' displayTitle='true' displayText={this.state.locationName} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


//get user input of the day of travel and location
//pull weather history from wunderground for the day but from previous years and location of the place
//display as 24hrs - maybe for a few years
//add google directions