import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Chart from './Chart.js';
import Qs from 'qs';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      locationEntered: '',
      location: '',
      locationName: '',
      // date: '',
      dateEntered: '',
      //chart states
      chartData: {},
      year: '',
      yearEntered: '',
      renderChartsArray: []
    };
    this.changePlaceHandler = this.changePlaceHandler.bind(this);
    this.enterInputs = this.enterInputs.bind(this);
    this.timeFormat = this.timeFormat.bind(this);
    this.yearHandler = this.yearHandler.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
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
            label: 'Temperature',
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
    console.log(inputDate[0]);
    console.log(inputDate[1]);
    axios.get(`http://api.wunderground.com/api/28cbe1ca6cde9931/history_2016${inputDate[0]}${inputDate[1]}/geolookup/q/${cords.lat},${cords.lng}.json`)
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

  yearHandler(e){
    this.setState({
      year: e.target.value
    })
  }
 
  timeFormat(n) { 
    return n < 10 ? '0' + n : '' + n; 
  }
  
  enterInputs(e){
    e.preventDefault();

    const locationClone = this.state.location;
    const dateClone = this.state.date;
    const yearClone = this.state.year;
    // this.setState({
    //   locationEntered: locationClone,
    //   dateEntered: dateClone,
    //   yearEntered: yearClone
    // })
    console.log('entered');

    const dayInputed = this.state.date._d.getDate();
    const monthInputed = this.state.date._d.getMonth() + 1;
    const dayInputFormatted = this.timeFormat(dayInputed);
    const monthInputFormatted = this.timeFormat(monthInputed);
    const monthDay = [monthInputFormatted, dayInputFormatted];

    // this.getCords(this.state.locationEntered);
    setTimeout(() => this.getCords(this.state.locationEntered, monthDay), 1000);
    
    
    let newChart = <Chart chartData={this.state.chartData} legendPosition='bottom' displayTitle='true' displayText={this.state.locationName} />;
    const renderChartsArrayClone = Array.from(this.state.renderChartsArray);
    
    console.log(renderChartsArrayClone.unshift(newChart));
    this.setState({
      locationEntered: locationClone,
      dateEntered: dateClone,
      yearEntered: yearClone,
      renderChartsArray: renderChartsArrayClone
    })
  }

  renderCharts(){
    // return this.state.renderChartsArray.map((renderChart) => {
      return <Chart chartData={this.state.chartData} legendPosition='bottom' displayTitle='true' displayText={this.state.locationName} />
    // });
  }

  render() {

    return (
      <div>
        <form action="" onSubmit={this.enterInputs}>
          <input type="text" name='place' onChange={this.changePlaceHandler} value={this.state.location}/>
          <SingleDatePicker
            date={this.state.date} // momentPropTypes.momentObj or null
            onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
            focused={this.state.focused} // PropTypes.bool
            onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
          />
          <YearSelector year={this.state.year} yearHandle={this.yearHandler}/>
          <button>Enter your location</button>
        </form>
        {/* {this.state.tickets}
        {this.renderCharts()} */}
        {this.state.renderChartsArray.map((chart) => {
          return chart
        })}
        
      </div>
    )
  }
}

const YearSelector = (props) => {
  return (
    <select id="yearSelector" value={props.year} onChange={props.yearHandle}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select> 
  );
}

ReactDOM.render(<App />, document.getElementById('app'));


//get user input of the day of travel and location
//pull weather history from wunderground for the day but from previous years and location of the place
//display as 24hrs - maybe for a few years
//add google directions