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
      dateEntered: '',
      year: '',
      yearEntered: '2018',
      renderChartsArray: [],
      chartData: {
        labels: ['0000Hrs', '0100Hrs', '0200Hrs', '0300Hrs', '0400Hrs', '0500Hrs', '0600Hrs', '0700Hrs', '0800Hrs', '0900Hrs', '1000Hrs', '1100Hrs', '1200Hrs', '1300Hrs', '1400Hrs', '1500Hrs', '1600Hrs', '1700Hrs', '1800Hrs', '1900Hrs', '2000Hrs', '2100Hrs', '2200Hrs', '2300Hrs','2400Hrs'],
        datasets: [
          {
            label: '2016',
            data: [],
            hoverBackgroundColor: 'rgb(255,242,117)'
          },
          {
            label: '2015',
            data: [],
            hoverBackgroundColor: 'rgb(0,242,117)'
          },
          {
            label: '2014',
            data: [],
            hoverBackgroundColor: 'rgb(255,0,117)'
          },
          {
            label: '2013',
            data: [],
            hoverBackgroundColor: 'rgb(255,242,0)'
          },
        ]
      },
      containerArray: []
    };
    this.changePlaceHandler = this.changePlaceHandler.bind(this);
    this.enterInputs = this.enterInputs.bind(this);
    this.timeFormat = this.timeFormat.bind(this);
    this.multiCall = this.multiCall.bind(this);
  }


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

      this.multiCall(cords, inputDate);
    });
  }

  multiCall(cords, inputDate){
    let newArray = [];

    for (let i = 0; i < 4; i++) {
      newArray.push(this.getWeather(cords, inputDate, 2017 - i));
    }
    Promise.all(newArray)
      .then(data => {
        console.log(data);
        
        const getCircularReplacer = () => {
          const seen = new WeakSet;
          return (key, value) => {
            if (typeof value === "object" && value !== null) {
              if (seen.has(value)) {
                return;
              }
              seen.add(value);
            }
            return value;
          };
        };

        //clones the object
        // const chartDataClone = JSON.parse(JSON.stringify(this.state.chartData, getCircularReplacer()));
        const chartDataClone = Object.assign({}, this.state.chartData);

        for (let i = 0; i < 4; i++){
          //updates the bargraph values
          chartDataClone.datasets[i].data = data[i];
        }

        console.log(chartDataClone);

        this.setState({
          chartData: chartDataClone
        })
      })
  }
  
  getWeather(cords, inputDate, year){
    //wunderground api
    console.log(inputDate[0]);
    console.log(inputDate[1]);
    return axios.get(`http://api.wunderground.com/api/28cbe1ca6cde9931/history_${year}${inputDate[0]}${inputDate[1]}/geolookup/q/${cords.lat},${cords.lng}.json`)
      .then((res) => {
        // console.log(res.data);

        const weatherObservationsTotal = res.data.history.observations;

        //array of all the hours in the day
        let weatherObservationsArray = [];
        //loops through and grabs all the hour updates
        for (let i = 0; i < weatherObservationsTotal.length; i++){
          weatherObservationsArray.push(weatherObservationsTotal[i].date.hour + '00Hrs')
        };
        
        //array of all the temp in the hours
        let tempPerHourArray = [];
        //loops through and grabs all the temp for everyhour
        for (let i = 0; i < weatherObservationsTotal.length; i++){
          tempPerHourArray.push(weatherObservationsTotal[i].tempm)
        };
        console.log(tempPerHourArray);
        return tempPerHourArray;

        // this.setState(prevState => ({
        //   containerArray: [...prevState.containerArray, tempPerHourArray]
        // }))






















        // const getCircularReplacer = () => {
        //   const seen = new WeakSet;
        //   return (key, value) => {
        //     if (typeof value === "object" && value !== null) {
        //       if (seen.has(value)) {
        //         return;
        //       }
        //       seen.add(value);
        //     }
        //     return value;
        //   };
        // };
        
        // //clones the object
        // const chartDataClone = JSON.parse(JSON.stringify(this.state.chartData, getCircularReplacer()));

        // //updates the labels to hours
        // chartDataClone.labels = weatherObservationsArray;
        // //updates the bargraph values
        // chartDataClone.datasets[0].data = tempPerHourArray;
        // //grabs the location name 
        // const newLocationName = res.data.location.city;

        // console.log(chartDataClone);


        // this.setState({
        //   testerArray: chartDataClone
        // }, () => {
        //   console.log(this.state.testerArray)
        // })
      })
  }

  changePlaceHandler(e){
    this.setState({
      location: e.target.value,
    })
  }

 
  timeFormat(n) { 
    return n < 10 ? '0' + n : '' + n; 
  }
  
  enterInputs(e){
    e.preventDefault();

    const locationClone = this.state.location;
    const dateClone = this.state.date;
    console.log('entered');

    const dayInputed = this.state.date._d.getDate();
    const monthInputed = this.state.date._d.getMonth() + 1;
    const dayInputFormatted = this.timeFormat(dayInputed);
    const monthInputFormatted = this.timeFormat(monthInputed);
    const monthDay = [monthInputFormatted, dayInputFormatted];

    //delay for updating input
    setTimeout(() => this.getCords(this.state.locationEntered, monthDay, this.state.yearEntered), 500);
    
    
    let newChart = <Chart chartData={this.state.chartData} legendPosition='bottom' displayTitle='true' displayText={this.state.locationName} />;
    const renderChartsArrayClone = Array.from(this.state.renderChartsArray);
    
    console.log(renderChartsArrayClone.unshift(newChart));
    this.setState({
      locationEntered: locationClone,
      dateEntered: dateClone,
      renderChartsArray: renderChartsArrayClone
    })


  }


  render() {

    return (
      <div className='mainSection'>
        <div className='wrapper'>
          <h1 className="appTitle">Weather History App</h1>
          <div className="infoSection">
            <h1 className='description'>Enter your destination and date of travel to get the weather trend for a selected year.</h1>
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
              </div>
              <button>Enter your location</button>
            </form>
          </div>

          <Chart chartData={this.state.chartData} legendPosition='bottom' displayTitle='true' displayText={this.state.locationName}  />


        </div>
        
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));