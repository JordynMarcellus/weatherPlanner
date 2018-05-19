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
      year: '',
      yearEntered: '2018',
      renderChartsArray: [],
      chartData: {
        labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14','15','16','17','18','19','20', '21','22','23','24'],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.6)'

          }
        ]
      }
    };
    this.changePlaceHandler = this.changePlaceHandler.bind(this);
    this.enterInputs = this.enterInputs.bind(this);
    this.timeFormat = this.timeFormat.bind(this);
    this.yearHandler = this.yearHandler.bind(this);
  }

  // componentWillMount(){
  //   this.getChartData();
  // }

  // getChartData(){
  //   this.setState({
  //     chartData: {
  //       labels: [],
  //       datasets: [
  //         {
  //           label: '',
  //           data: [],
  //           backgroundColor: 'rgba(54, 162, 235, 0.6)'
 
  //         }
  //       ]
  //     }
  //   });
  // }

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

  getCords(inputAddress, inputDate, year){
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
      this.getWeather(cords, inputDate, year)
    });
  }
  
  getWeather(cords, inputDate, year){
    //wunderground api
    console.log(inputDate[0]);
    console.log(inputDate[1]);
    console.log(year);
    axios.get(`http://api.wunderground.com/api/28cbe1ca6cde9931/history_${year}${inputDate[0]}${inputDate[1]}/geolookup/q/${cords.lat},${cords.lng}.json`)
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
    setTimeout(() => this.getCords(this.state.locationEntered, monthDay, this.state.yearEntered), 500);
    
    
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


  render() {

    return (
      <div className='mainSection'>
        <div className='wrapper'>
          <div className="infoSection">
            <h1>Enter your destination and date of travel to get the weather trend for a selected year.</h1>
            <form action="" onSubmit={this.enterInputs}>
              <input className='locationInput' placeholder='Enter location' type="text" name='place' onChange={this.changePlaceHandler} value={this.state.location}/>
              <div className='timeInputs'>
                <SingleDatePicker
                  date={this.state.date} // momentPropTypes.momentObj or null
                  onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                  focused={this.state.focused} // PropTypes.bool
                  onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                  isOutsideRange={() => false}
                  displayFormat="MMM DD"
                />
                <YearSelector year={this.state.year} yearHandle={this.yearHandler}/>
              </div>
              <button>Enter your location</button>
            </form>
          </div>

            <Chart chartData={this.state.chartData} legendPosition='bottom' displayTitle='true' displayText={this.state.locationName} />


        </div>
        
      </div>
    )
  }
}

const YearSelector = (props) => {
  return (
    <select id="yearSelector" value={props.year} onChange={props.yearHandle}>
      <option value="">Select a year</option>
      <option value="2017">2017</option>
      <option value="2016">2016</option>
      <option value="2015">2015</option>
      <option value="2014">2014</option>
      <option value="2013">2013</option>
      <option value="2012">2012</option>
      <option value="2011">2011</option>
      <option value="2010">2010</option>
      <option value="2009">2009</option>
    </select> 
  );
}

ReactDOM.render(<App />, document.getElementById('app'));


//get user input of the day of travel and location
//pull weather history from wunderground for the day but from previous years and location of the place
//display as 24hrs - maybe for a few years
//add google directions